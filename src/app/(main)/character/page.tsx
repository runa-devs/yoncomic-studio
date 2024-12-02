import { Header } from "@/components/layout/header";
import { auth } from "@/lib/auth";
import { Noto_Sans_JP } from "next/font/google";
import Characterform from "./_components/form";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300"],
});
const logo = "/logo.svg";

export default async function generate() {
  const session = await auth();
  return (
    <>
      <Header />
      <Characterform />
    </>
  );
}
