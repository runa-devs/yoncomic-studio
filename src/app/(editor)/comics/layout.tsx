import { Header } from "@/components/layout/header";
import { Protected } from "@/components/layout/protected";

export default function ComicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Protected>{children}</Protected>
    </>
  );
}
