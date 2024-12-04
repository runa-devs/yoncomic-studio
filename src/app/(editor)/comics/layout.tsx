import { Header } from "@/components/layout/header";
import { ReactNode } from "react";

export default function ComicsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
