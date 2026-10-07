import Link from "next/link";
import { PageHeader, Section, StatCard } from "@/components/ui/PageParts";
import { Dot, Meter } from "@/components/ui/Primitives";
import { OrderStatusChip } from "@/components/admin/Chips";
import { IconAlert, IconBox, IconClock, IconStore, IconTruck, IconWrench } from "@/components/ui/Icons";
import { dashboardService } from "@/services/dashboardService";
import { formatVnd } from "@/lib/money";
import { ORDER_STATUS } from "@/lib/order-status";

export default function DashboardPage() {
  const data = dashboardService.getDashboardData();
  const { counters: c, attention, timeline, distribution, topProducts } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảng điều hành"
        description="Tổng quan vận hành và các chỉ số kinh doanh trang phục cho thuê."
        actions={
          <Link href="/admin/orders" className="btn btn-sm">
            Xem tất cả đơn
          </Link>
        }
      />

      {attention.length > 0 && (
        <Section title="Cần xử lý ngay" description="Các công việc phát sinh cần nhân viên chú ý trong ngày.">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {attention.map((item) => (
              <div key={item.id} className="card card-pad flex flex-col justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 rounded bg-warning-soft p-1 text-warning">
                    <IconAlert width={15} height={15} />
                  </span>
                  <div>
                    <h3 className="text-[13px] font-semibold">{item.title}</h3>
                    <p className="mt-1 text-[12px] text-ink-2">{item.detail}</p>
                  </div>
                </div>
                <Link href={item.href} className="btn btn-outline btn-sm mt-3 self-start">
                  {item.actionLabel}
                </Link>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Nhận đồ hôm nay"
          value={c.todayPickups}
          sub="Đến hạn giao"
          icon={<IconStore width={16} height={16} />}
          href="/admin/orders"
        />
        <StatCard
          label="Trả đồ hôm nay"
          value={c.todayReturns}
          sub="Đến hạn nhận lại"
          icon={<IconTruck width={16} height={16} />}
          href="/admin/orders"
        />
        <StatCard
          label="Đang cho thuê"
          value={c.activeRentals}
          sub="Đang ở chỗ khách"
          tone="info"
        />
        <StatCard
          label="Quá hạn"
          value={c.overdue}
          tone={c.overdue > 0 ? "danger" : "neutral"}
          sub="Cần thu hồi"
          icon={<IconClock width={16} height={16} />}
          href="/admin/orders"
        />
        <StatCard
          label="Đang giặt ủi"
          value={c.cleaning}
          tone="warning"
          sub="Chờ kiểm tra kho"
          icon={<IconWrench width={16} height={16} />}
        />
        <StatCard
          label="Doanh thu 30 ngày"
          value={formatVnd(c.revenue30d)}
          tone="success"
          sub="Chưa gồm cọc"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Hàng đợi hôm nay" description="Lịch bàn giao và nhận trả đồ theo giờ.">
          <div className="card overflow-hidden">
            {timeline.length === 0 ? (
              <p className="p-6 text-center text-xs text-ink-2">Hôm nay không có lịch hẹn giao nhận đồ.</p>
            ) : (
              <ul className="divide-y divide-line">
                {timeline.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-3 text-[12.5px]">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-ink-2 w-12">{item.time}</span>
                      <div>
                        <p className="font-medium text-ink">
                          {item.customerName} · <span className="text-ink-2">{item.orderCode}</span>
                        </p>
                        <p className="text-[11.5px] text-ink-3">{item.summary}</p>
                      </div>
                    </div>
                    <OrderStatusChip status={item.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        <Section title="Đơn thuê theo trạng thái" description="Tỷ lệ phân bố đơn hàng trong hệ thống.">
          <div className="card card-pad space-y-3">
            {distribution.map((row) => {
              const meta = ORDER_STATUS[row.status] || { label: row.status, tone: "neutral" };
              const percent = Math.round((row.count / 6) * 100);
              return (
                <div key={row.status} className="flex items-center gap-3 text-[12.5px]">
                  <span className="flex w-36 items-center gap-2">
                    <Dot tone={meta.tone} />
                    <span className="truncate">{meta.label}</span>
                  </span>
                  <div className="flex-1">
                    <Meter value={percent} tone={meta.tone} />
                  </div>
                  <span className="w-8 text-right font-semibold">{row.count}</span>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <Section title="Sản phẩm được thuê nhiều nhất" description="Xếp hạng theo lượt thuê thực tế.">
        <div className="card overflow-hidden">
          <ul className="divide-y divide-line">
            {topProducts.map((p, idx) => (
              <li key={p.slug} className="flex items-center justify-between p-3.5 text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-ink-3 w-6">{idx + 1}</span>
                  <span className="font-medium text-ink">{p.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[12px] text-ink-2">{p.rentals} lượt thuê</span>
                  <span className="font-semibold text-accent">{formatVnd(p.revenue)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}
