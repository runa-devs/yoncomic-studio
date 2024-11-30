import { auth } from "@/lib/auth";
import { Noto_Sans_JP } from "next/font/google";
import { Genui } from "./_components/genui";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300"],
});
const logo = "/logo.svg";

export default async function generate() {
  const session = await auth();
  return <Genui />;
}
