import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "4コマ漫画のOGP画像";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const getComicById = async (id: string) => {
  const comic = await fetch(
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/comics/${id}`
  ).then((res) => res.json());
  return comic;
};

export default async function Image({ params }: { params: { id: string } }) {
  const notoSansJP = fetch(new URL("./NotoSansJP-Regular.otf", import.meta.url), {
    cache: "no-cache",
  }).then((res) => res.arrayBuffer());

  const comic = await getComicById(params.id);

  if (!comic) {
    return new ImageResponse(<div>Comic not found</div>, { ...size });
  }

  return new ImageResponse(
    (
      <div tw="bg-white w-full h-full flex flex-col font-sans">
        <div tw="flex justify-center items-center flex-1 mt-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${comic.panels[0].key ?? comic.panels[0].originalKey}`}
            alt="4コマ漫画"
            width={960}
            height={658}
          />
        </div>
        <div tw="flex justify-between items-center bg-gray-100/90 rounded-lg p-3">
          <div tw="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/logo.svg`}
              alt="Yoncomic Studio"
              width={100}
              height={100}
            />
            <div tw="text-5xl text-gray-600 ml-4">Yoncomic Studio</div>
          </div>
          <div tw="bg-gray-200 px-5 py-3 rounded-lg text-2xl text-gray-700">#技育キャンプ</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans JP",
          data: await notoSansJP,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
