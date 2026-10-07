import { Hero } from "@/components/user/Hero";
import { HomeDateBar } from "@/components/user/HomeDateBar";
import {
  CategoryStrip,
  EditorialBlock,
  HowItWorks,
  Lookbook,
  Marquee,
  OccasionGrid,
  ReviewWall,
  SectionHead,
  WhyRent,
} from "@/components/user/HomeSections";
import { ProductRail } from "@/components/user/ProductGrid";
import { homeService } from "@/services/homeService";

export default async function HomePage() {
  const newArrivals = await homeService.getNewArrivals();
  const trending = await homeService.getTrendingProducts();

  return (
    <>
      <Hero />
      <HomeDateBar />
      <Marquee />

      <section className="shell py-20 md:py-28">
        <SectionHead
          eyebrow="Tủ đồ"
          title="Thuê theo danh mục"
          link={{ label: "Toàn bộ bộ sưu tập", href: "/products" }}
        />
        <CategoryStrip />
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead
          eyebrow="Vừa nhập tủ"
          title="Mới về"
          link={{ label: "Xem tất cả", href: "/products" }}
        />
        <ProductRail products={newArrivals} />
      </section>

      <section className="bg-warm py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Khách quay lại nhiều nhất"
            title="Đang được thuê nhiều"
            link={{ label: "Xem bảng xếp hạng", href: "/products" }}
          />
          <ProductRail products={trending} />
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead eyebrow="Dịp sử dụng" title="Bạn cần đồ cho dịp nào?" />
        <OccasionGrid />
      </section>

      <section className="shell py-20 md:py-28">
        <EditorialBlock />
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead
          eyebrow="Bốn bước"
          title="Thuê đồ hoạt động thế nào"
          link={{ label: "Hướng dẫn chi tiết", href: "/products" }}
        />
        <HowItWorks />
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead eyebrow="Vì sao thuê" title="Mặc nhiều hơn, sở hữu ít đi" align="center" />
        <WhyRent />
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead eyebrow="Khách nói gì" title="Đánh giá sau khi trả đồ" />
        <ReviewWall />
      </section>

      <section className="shell pb-8 pt-20 md:pt-28">
        <SectionHead eyebrow="Lookbook" title="Ảnh khách gửi về" />
        <Lookbook />
      </section>
    </>
  );
}
