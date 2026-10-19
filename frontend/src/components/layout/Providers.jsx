"use client";

import { AuthProvider } from "@/store/auth";
import { ToastProvider } from "@/components/ui/Toast";
import { CartProvider } from "@/store/cart";
import { RentalDatesProvider } from "@/store/rentalDates";
import { WishlistProvider } from "@/store/wishlist";

export function Providers({ children }) {
  return (
    <ToastProvider>
      <RentalDatesProvider>
        <WishlistProvider>
          <CartProvider><AuthProvider>{children}</AuthProvider></CartProvider>
        </WishlistProvider>
      </RentalDatesProvider>
    </ToastProvider>
  );
}
