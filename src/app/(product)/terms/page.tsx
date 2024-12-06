import { notoSansJP } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className={cn("text-3xl font-bold md:text-4xl", notoSansJP.className)}>利用規約</h1>

        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              1. はじめに
            </h2>
            <p>
              本利用規約（以下「本規約」）は、Yoncomic
              Studio（以下「本サービス」）の利用条件を定めるものです。
              本サービスは、ハッカソンプロジェクトとして開発された期間限定のサービスです。
              本サービスを利用する全ての方（以下「ユーザー」）は、本規約に同意の上でご利用ください。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              2. 利用登録
            </h2>
            <p>
              本サービスの利用登録（ログイン）を行うことにより、ユーザーは本規約に同意したものとみなします。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              3. 著作権
            </h2>
            <p>
              本サービスを通じて生成されたAI作品を含むすべてのコンテンツ（以下「生成コンテンツ」）の著作権は、
              Yoncomic Studioに帰属します。
              ユーザーは、生成コンテンツを個人的な利用目的に限り使用することができますが、
              事前の書面による許可なしに以下の行為を行うことを禁じます：
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>複製、転載、配布、販売</li>
              <li>その他、著作権法に抵触する行為</li>
              <li>生成コンテンツを利用して、他者の著作権やプライバシーを侵害する行為</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              4. 禁止事項
            </h2>
            <p>ユーザーは、本サービスの利用に際し、以下の行為を禁じます：</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>法令または公序良俗に反する行為</li>
              <li>犯罪行為またはこれを助長する行為</li>
              <li>本サービスの正常な運営を妨げる行為</li>
              <li>他者の知的財産権やプライバシーを侵害する行為</li>
              <li>本サービスに対するスクレイピングやAPIの不正利用、自動化ツールの使用</li>
              <li>本サービスを利用して得た情報を商業目的で利用する行為</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              5. サービスの提供期間と停止等
            </h2>
            <p>
              本サービスは期間限定のプロジェクトとして提供されます。当組織は、以下のいずれかの事由があると判断した場合、
              ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができます：
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>プロジェクト期間が終了した場合</li>
              <li>システムの保守点検または更新を行う場合</li>
              <li>
                地震、落雷、火災、停電、天災などの不可抗力により、本サービスの提供が困難となった場合
              </li>
              <li>その他、当組織が本サービスの提供が困難と判断した場合</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              6. 免責事項
            </h2>
            <p>
              当組織は、本サービスの完全性、正確性、有用性等について一切保証しません。
              また、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              7. サービス内容の変更等
            </h2>
            <p>
              当組織は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、
              これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              8. 利用規約の変更
            </h2>
            <p>
              当組織は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
              なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className={cn("text-xl font-semibold text-foreground", notoSansJP.className)}>
              9. 準拠法および裁判管轄
            </h2>
            <p>
              本規約の解釈および本サービスに関する事項には日本法が適用されます。
              本サービスに関連して生じる紛争については、当組織の本店所在地を管轄する裁判所を
              専属的合意管轄裁判所とします。
            </p>
          </section>
        </div>

        <p className="text-sm text-muted-foreground">制定日: 2024年12月7日</p>
      </div>
    </main>
  );
}
