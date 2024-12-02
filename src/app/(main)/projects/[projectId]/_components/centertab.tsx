import { useState } from "react";

export const CenterTab = () => {
  const [selectedCell, setSelectedCell] = useState<number>(1);
  return (
    <div className="flex-1 border-b">
      <div className="size-full border-b bg-gray-100">
        <div className="flex size-full items-center justify-center rounded-lg bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {(() => {
            const cell_style =
              "aspect-[3/2] w-[700px] rounded-sm border-2 border-gray-300 bg-white items-center flex justify-center text-[100px]";
            switch (selectedCell) {
              case 0:
                return (
                  <div>
                    <section
                      id="1"
                      className="flex aspect-[3/2] w-[300px] items-center justify-center bg-white text-[80px]"
                    >
                      <span>1</span>
                    </section>
                    <section
                      id="2"
                      className="flex aspect-[3/2] w-[300px] items-center justify-center bg-white text-[80px]"
                    >
                      <span>2</span>
                    </section>
                    <section
                      id="3"
                      className="flex aspect-[3/2] w-[300px] items-center justify-center bg-white text-[80px]"
                    >
                      <span>3</span>
                    </section>
                    <section
                      id="4"
                      className="flex aspect-[3/2] w-[300px] items-center justify-center bg-white text-[80px]"
                    >
                      <span>4</span>
                    </section>
                  </div>
                );
              case 1:
                return (
                  <section id="1" className={cell_style}>
                    <span>1</span>
                  </section>
                );
              case 2:
                return (
                  <section id="2" className={cell_style}>
                    2
                  </section>
                );
              case 3:
                return (
                  <section id="3" className={cell_style}>
                    3
                  </section>
                );
              case 4:
                return (
                  <section id="4" className={cell_style}>
                    4
                  </section>
                );
              default:
                return null; // それ以外の場合は何も表示しない
            }
          })()}
        </div>
      </div>
    </div>
  );
};
