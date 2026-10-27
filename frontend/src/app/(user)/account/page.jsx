"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { userService } from "@/services/userService";
import { useToast } from "@/components/ui/Toast";
import {
  IconBox,
  IconCheck,
  IconShield,
  IconUser,
} from "@/components/ui/Icons";

function ProfileForm({ user, onProfileUpdated }) {
  const toast = useToast();
  const [fullname, setFullname] = useState(user.fullname || user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await userService.updateProfile({
        fullname: fullname.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      if (onProfileUpdated) {
        await onProfileUpdated({
          fullname: res.fullname || fullname.trim(),
          phone: res.phone || phone.trim(),
          address: res.address || address.trim(),
        });
      }

      setSuccess("Cập nhật thông tin cá nhân thành công!");
      toast.push({
        tone: "success",
        title: "Thành công",
        body: "Đã lưu thông tin tài khoản của bạn.",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại thông tin.";
      setError(msg);
      toast.push({
        tone: "error",
        title: "Lỗi",
        body: msg,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-lg font-serif font-bold text-ink">
          Thông tin cá nhân
        </h2>
        <p className="mt-1 text-xs text-ink-2">
          Thông tin liên hệ được sử dụng khi lập hợp đồng và giao nhận đơn thuê trang phục.
        </p>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800">
          <IconCheck width={16} height={16} className="shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="fullname" className="block text-xs font-medium text-ink mb-1.5">
              Họ và tên <span className="text-danger">*</span>
            </label>
            <input
              id="fullname"
              type="text"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink placeholder:text-ink-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-ink mb-1.5">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912 345 678"
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink placeholder:text-ink-3 outline-none focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-ink mb-1.5">
            Địa chỉ Email
          </label>
          <input
            id="email"
            type="email"
            disabled
            value={user.email || ""}
            className="w-full rounded-md border border-line bg-line/30 px-3 py-2 text-xs text-ink-2 outline-none cursor-not-allowed"
          />
          <p className="mt-1 text-[11px] text-ink-3">
            Email dùng làm tài khoản đăng nhập và nhận thông báo hóa đơn, không thể thay đổi.
          </p>
        </div>

        <div>
          <label htmlFor="address" className="block text-xs font-medium text-ink mb-1.5">
            Địa chỉ giao / trả trang phục mặc định
          </label>
          <textarea
            id="address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink placeholder:text-ink-3 outline-none focus:border-accent"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn text-xs font-medium disabled:opacity-60"
          >
            {saving ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordForm() {
  const toast = useToast();
  const [showSection, setShowSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setError("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }

    setSaving(true);

    try {
      await userService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });

      setSuccess("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
      toast.push({
        tone: "success",
        title: "Đổi mật khẩu thành công",
        body: "Mật khẩu của bạn đã được cập nhật.",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.";
      setError(msg);
      toast.push({
        tone: "error",
        title: "Lỗi",
        body: msg,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
        <div>
          <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
            <IconShield width={18} height={18} className="text-ink-2" />
            <span>Bảo mật & Mật khẩu</span>
          </h2>
          <p className="mt-1 text-xs text-ink-2">
            Quản lý mật khẩu để bảo vệ an toàn cho tài khoản của bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSection(!showSection)}
          className="text-xs font-medium text-accent hover:underline"
        >
          {showSection ? "Thu gọn" : "Đổi mật khẩu"}
        </button>
      </div>

      {showSection && (
        <div>
          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800">
              <IconCheck width={16} height={16} className="shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-xs font-medium text-ink mb-1.5"
              >
                Mật khẩu hiện tại
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-medium text-ink mb-1.5"
              >
                Mật khẩu mới (tối thiểu 8 ký tự)
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label
                htmlFor="newPasswordConfirmation"
                className="block text-xs font-medium text-ink mb-1.5"
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                id="newPasswordConfirmation"
                type="password"
                required
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-xs text-ink outline-none focus:border-accent"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn text-xs font-medium disabled:opacity-60"
              >
                {saving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default function AccountPage() {
  const { user, loading: authLoading, updateUser, refreshUser } = useAuth();

  if (authLoading) {
    return (
      <div className="shell py-24 text-center">
        <p className="text-sm text-ink-2">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="shell py-24 text-center max-w-md mx-auto">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <IconUser width={28} height={28} />
        </div>
        <h1 className="text-2xl font-serif text-ink font-bold mb-3">Quản lý tài khoản</h1>
        <p className="text-sm text-ink-2 mb-6">
          Vui lòng đăng nhập để xem và cập nhật hồ sơ cá nhân của bạn.
        </p>
        <Link href="/login" className="btn">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const displayName = user.fullname || user.name || "Khách hàng";
  const initialLetter = displayName.trim().charAt(0).toUpperCase() || "U";

  async function handleProfileUpdated(updated) {
    updateUser(updated);
    await refreshUser();
  }

  return (
    <div className="shell py-12 md:py-16 max-w-5xl mx-auto">
      <div className="border-b border-line pb-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/15 text-2xl font-bold text-accent">
              {initialLetter}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif text-ink font-bold">
                  {displayName}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-ink-2">
                {user.email} · Tài khoản đang hoạt động
              </p>
            </div>
          </div>

          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent hover:underline sm:self-center"
          >
            <IconBox width={16} height={16} />
            <span>Xem đơn thuê của tôi &rarr;</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
        <aside className="rounded-xl border border-line bg-surface/50 p-4 space-y-1">
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-3">
            Điều hướng
          </p>
          <div className="flex items-center gap-2.5 rounded-lg bg-ink px-3 py-2.5 text-xs font-medium text-canvas">
            <IconUser width={16} height={16} />
            <span>Hồ sơ cá nhân</span>
          </div>

          <Link
            href="/orders"
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-ink hover:bg-line/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <IconBox width={16} height={16} className="text-ink-3" />
              <span>Đơn thuê trang phục</span>
            </div>
          </Link>

          <div className="pt-4 mt-4 border-t border-line/60">
            <div className="px-3 py-2 text-[12px] text-ink-3 space-y-1">
              <p className="font-medium text-ink">StyleRent Member</p>
              <p>Thuê trang phục cao cấp linh hoạt & tiện lợi.</p>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <ProfileForm
            key={user.id || user.email}
            user={user}
            onProfileUpdated={handleProfileUpdated}
          />
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
