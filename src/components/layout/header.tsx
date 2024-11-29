import { SignInButton } from "@/components/auth/signin-button";
import { SignOutButton } from "@/components/auth/signout-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, Menu } from "lucide-react";
import { Noto_Sans_JP } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300"],
});

const logo = "logo.svg";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/20 backdrop-blur-md">
      <div className="flex items-center">
        <div className="flex flex-1 items-center gap-x-3 p-3">
          <div className="flex items-center gap-x-2">
            <Button size={"icon"} variant={"outline"} className="md:hidden">
              <Menu />
            </Button>
            <Link className="flex items-center space-x-2" href="/">
              <Image src={logo} alt="Logo" width={30} height={30} />
              <span className={cn("inline-block text-lg", notoSansJP.className)}>
                Yoncomic Studio
              </span>
            </Link>
          </div>
          <nav className="hidden flex-1 items-center gap-x-6 text-lg md:flex">
            <Link href="/about">About</Link>
            <Link href="/products">Products</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <nav className="mr-5 flex items-center space-x-2">
            {session ? (
              <SignOutButton className="gap-2">
                <LogOut size={16} />
                Sign Out
              </SignOutButton>
            ) : (
              <SignInButton className="gap-2">
                <LogIn size={16} />
                Sign In
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
