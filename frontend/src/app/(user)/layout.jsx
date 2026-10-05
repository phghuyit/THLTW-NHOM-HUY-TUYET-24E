import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
