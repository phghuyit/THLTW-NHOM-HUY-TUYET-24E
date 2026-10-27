<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class VNPayController extends Controller
{
    /**
     * Tạo URL thanh toán VNPay và trả về cho frontend
     */
    public function createPaymentUrl(Request $request)
    {
        $vnp_TmnCode = config('services.vnpay.tmn_code');
        $vnp_HashSecret = config('services.vnpay.hash_secret');
        $vnp_Url = config('services.vnpay.url');
        $vnp_Returnurl = config('services.vnpay.return_url');

        $vnp_TxnRef = $request->input('order_code') ?? ('SR' . time());
        $vnp_OrderInfo = "Thanh toan don thue " . $vnp_TxnRef;
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = ((int) $request->input('amount', 500000)) * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip() ?? '127.0.0.1';

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);
        $query = "";
        $hashdata = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return response()->json([
            'status' => 'success',
            'payment_url' => $vnp_Url,
            'order_code' => $vnp_TxnRef,
        ]);
    }

    /**
     * Xử lý kết quả trả về từ VNPay (IPN webhook - server to server)
     */
    public function handleIPN(Request $request)
    {
        $vnp_HashSecret = config('services.vnpay.hash_secret');
        $inputData = [];

        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);

        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash === $vnp_SecureHash) {
            $orderCode = $inputData['vnp_TxnRef'] ?? null;
            $order = Order::where('order_code', $orderCode)->first();

            if ($order) {
                if ($inputData['vnp_ResponseCode'] == '00') {
                    $order->status = 'confirmed';
                    $order->save();
                    return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
                } else {
                    $order->status = 'cancelled';
                    $order->save();
                    return response()->json(['RspCode' => '00', 'Message' => 'Payment Failed']);
                }
            }
            return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
        }

        return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
    }
}
