# Yoncomic Studio

AIを使った簡易4コマ漫画作成ツールです。Next.js 14とAI技術を活用し、誰でも簡単に4コマ漫画を作成できます。
技育キャンプハッカソン Vol.18の作品です。

## スクリーンショット

### ホーム画面

![ホーム画面](doc/home.png)

### 新規作成画面

![新規作成画面](doc/create.png)

### 生成画面

![生成画面](doc/generate.png)

### エディター画面

![エディター画面](doc/editor.png)

## 主な機能

- **AIによる4コマ展開**: AIが自動でストーリーを展開
- **高品質な画像生成**: 最新の画像生成モデルを活用
- **直感的な編集機能**: テキスト、吹き出し、手書き機能を搭載
- **簡単な共有機能**: SNSへの共有機能を実装
- **Next.js 14(App Router)**: 最新のReactフレームワークを活用
- **Auth.js**: セキュアな認証システム
- **Prisma**: 型安全なORMによるデータベース操作
- **PostgreSQL**: 信頼性の高いリレーショナルデータベース
- **Tailwind CSS**: カスタマイズ可能なユーティリティファーストCSSフレームワーク
- **shadcn/ui**: 再利用可能なUIコンポーネント
- **Docker**: 簡単な開発環境のセットアップ

## セットアップ手順

1. リポジトリのクローン

   ```bash
   git clone https://github.com/runa-devs/yoncomic-studio.git
   cd yoncomic-studio
   ```

2. 依存関係のインストール

   ```bash
   pnpm i
   ```

3. Auth.jsシークレットの生成

   ```bash
   pnpm dlx auth@latest secret
   ```

4. 環境変数の設定
   `.env.local`ファイルを作成し、必要な環境変数を設定:

   ```env
   AUTH_SECRET="your-auth-secret" # 生成済み

   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"

   CIVITAI_API_KEY="your-civitai-api-key"
   OPENAI_API_KEY="your-openai-api-key"

   S3_REGION="your-s3-region"
   S3_ACCESS_KEY_ID="your-s3-access-key-id"
   S3_SECRET_ACCESS_KEY="your-s3-secret-access-key"
   S3_BUCKET="your-s3-bucket"
   S3_ENDPOINT="your-s3-endpoint"
   NEXT_PUBLIC_S3_PUBLIC_URL="your-s3-public-url"

   VERCEL_PROJECT_PRODUCTION_URL="your-vercel-project-url"
   NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL="your-vercel-project-url"
   ```

5. ローカルの場合

   Webhookを正しく受信するために、`cloudflared`などでローカルのURLを公開してください。

   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

   表示されたURLを`VERCEL_PROJECT_PRODUCTION_URL`と`NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL`に設定してください。(`https://`は不要です。)

6. データベースのセットアップ

   ```bash
   docker-compose up -d
   ```

7. Prismaマイグレーションの実行

   ```bash
   pnpm prisma:migrate
   ```

8. 開発サーバーの起動

   ```bash
   pnpm dev
   ```

9. ブラウザで[http://localhost:3000](http://localhost:3000)を開いてアプリケーションを確認

## 使用技術

- [Next.js](https://nextjs.org/)
- [Auth.js](https://authjs.dev/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Docker](https://www.docker.com/)
- [OpenAI API](https://openai.com/)
- [Civitai](https://civitai.com/)

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## サポート

ご質問やお困りの点がありましたら、Issueを開くかプロジェクトメンテナーに直接お問い合わせください。

## スターのお願い

このプロジェクトが気に入りましたら、GitHubリポジトリへのスターをお願いします。皆様のサポートが、プロジェクトの改善と維持の大きな励みとなります。
