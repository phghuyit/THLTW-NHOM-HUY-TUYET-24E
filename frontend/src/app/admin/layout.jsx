import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas text-ink">
        <AdminSidebar />
        <div className="ml-60 flex min-h-screen flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
