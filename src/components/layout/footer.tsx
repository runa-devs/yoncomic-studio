import { notoSansJP } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div
            className={cn("flex items-center text-sm text-muted-foreground", notoSansJP.className)}
          >
            <Sparkles className="mr-2 size-4" />
            {new Date().getFullYear()} Runa Devs.
          </div>
          <nav>
            <ul className="flex space-x-6 text-sm text-muted-foreground">
              <li>
                <Link
                  href="https://github.com/runa-devs"
                  target="_blank"
                  className="hover:text-foreground"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  利用規約
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
