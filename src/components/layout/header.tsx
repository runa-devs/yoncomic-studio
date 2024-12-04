import { SignInButton } from "@/components/auth/signin-button";
import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LogIn, Menu } from "lucide-react";
import { Noto_Sans_JP } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300"],
});

const logo = "/logo.svg";

const navItems: { label: string; href: string }[] = [];

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/20 backdrop-blur-md">
      <div className="flex items-center">
        <div className="flex flex-1 items-center gap-x-3 p-1">
          <div className="flex items-center gap-x-2">
            <Button size={"icon"} variant={"outline"} className="md:hidden">
              <Menu />
            </Button>
            <Button variant={"ghost"} asChild>
              <Link className="flex items-center space-x-2" href="/">
                <Image src={logo} alt="Logo" width={30} height={30} />
                <span className={cn("inline-block text-lg", notoSansJP.className)}>
                  Yoncomic Studio
                </span>
              </Link>
            </Button>
          </div>
          <nav className="hidden flex-1 items-center gap-x-6 text-lg md:flex">
            {navItems.length > 0 &&
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <nav className="mr-5 flex items-center space-x-2">
            {session ? (
              <UserMenu />
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
