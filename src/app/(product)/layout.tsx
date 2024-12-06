import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
