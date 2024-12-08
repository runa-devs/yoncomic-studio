"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiX } from "react-icons/si";
import { toast } from "sonner";

export function ShareButtons({ comicId }: { comicId: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/comics/${comicId}/share`;

  const copyToClipboard = async () => {
    try {
      setCopied(true);
      await navigator.clipboard.writeText(shareUrl);
      toast.success("URLをコピーしました");
    } catch (err) {
      toast.error("コピーに失敗しました");
    } finally {
      setCopied(false);
    }
  };

  const shareToTwitter = () => {
    const text = "Yoncomic Studioでオリジナル漫画を作成しました！ #Yoncomic";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="mt-auto space-y-4 border-t bg-background p-4">
      <div className="flex gap-2">
        <Input value={shareUrl} readOnly className="flex-1" />
        <Button onClick={copyToClipboard} disabled={copied} variant="outline">
          {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
          コピー
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Button onClick={shareToTwitter} className="w-full bg-black">
          <SiX className="mr-2 size-5" />
          Xで共有
        </Button>
        <Button onClick={shareToFacebook} className="w-full bg-[#1877F2] hover:bg-[#166fe5]">
          <SiFacebook className="mr-2 size-5" />
          Facebookで共有
        </Button>
      </div>
    </div>
  );
}
