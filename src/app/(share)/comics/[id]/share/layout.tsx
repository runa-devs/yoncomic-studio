import { Header } from "@/components/layout/header";

export default function ComicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
