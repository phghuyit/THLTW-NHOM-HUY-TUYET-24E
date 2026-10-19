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


export const dynamic = "force-dynamic";

function ApiMessage({ failed, emptyText }) {
  return (
    <p role={failed ? "alert" : "status"} className="border border-line bg-surface px-6 py-10 text-center text-sm text-ink-2">
      {failed ? "Chưa tải được dữ liệu. Bạn vui lòng thử lại sau." : emptyText}
    </p>
  );
}

function HomeProducts({ result, emptyText }) {
  if (result.status === "rejected" || result.value.length === 0) {
    return <ApiMessage failed={result.status === "rejected"} emptyText={emptyText} />;
  }
  return <ProductRail products={result.value} />;
}

export default async function HomePage() {

  const [categories, newArrivals, featured, sale] = await Promise.allSettled([
    homeService.getCategories(),
    homeService.getNewArrivals(),
    homeService.getFeaturedProducts(),
    homeService.getSaleProducts(),
  ]);

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
        {categories.status === "fulfilled" && categories.value.length > 0 ? (
          <CategoryStrip categories={categories.value} />
        ) : (
          <ApiMessage failed={categories.status === "rejected"} emptyText="Chưa có danh mục đang có sản phẩm cho thuê." />
        )}
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead
          eyebrow="Vừa nhập tủ"
          title="Mới về"
          link={{ label: "Xem tất cả", href: "/products" }}
        />
        <HomeProducts result={newArrivals} emptyText="Chưa có sản phẩm mới." />
      </section>

      <section className="bg-warm py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Gợi ý từ StyleRent"
            title="Sản phẩm hot"
            link={{ label: "Xem tất cả sản phẩm hot", href: "/products?is_featured=1" }}
          />
          <HomeProducts result={featured} emptyText="Chưa có sản phẩm nổi bật." />
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <SectionHead
          eyebrow="Ưu đãi đang có"
          title="Sản phẩm sale"
          link={{ label: "Xem tất cả sản phẩm sale", href: "/products?is_sale=1" }}
        />
        <HomeProducts result={sale} emptyText="Hiện chưa có sản phẩm khuyến mãi." />
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
