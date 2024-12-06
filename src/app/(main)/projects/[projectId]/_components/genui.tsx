"use client";
import { CenterTab } from "@/app/(main)/projects/[projectId]/_components/centertab";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useState } from "react";

const logo = "logo.svg";

type TaskStatus = "waiting" | "generating" | "done";

const getStatusText = (status: TaskStatus): string => {
  switch (status) {
    case "waiting":
      return "待機中";
    case "generating":
      return "生成中";
    case "done":
      return "完了";
    default:
      return status;
  }
};

export const Genui = () => {
  const [selectedCell, setSelectedCell] = useState<number>(1);
  const [cfgScale, setCfgScale] = useState<number>(7);
  const [steps, setSteps] = useState<number>(20);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="relative flex min-h-svh">
      <div
        className={cn(
          `absolute z-10 flex h-full overflow-hidden border-r bg-gray-100 duration-300 ease-in-out`,
          isSidebarCollapsed ? "w-0" : "w-1/5 translate-x-0"
        )}
      >
        {!isSidebarCollapsed && (
          <>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="generate" className="m-2 rounded-3xl bg-white shadow-sm">
                <AccordionTrigger className="rounded-3xl  bg-white px-4">
                  生成キュー
                </AccordionTrigger>
                <AccordionContent className="rounded-b-3xl  bg-white px-4"></AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </div>

      <Button
        onClick={toggleSidebar}
        className={cn(
          `absolute z-50 m-2 size-12 border-collapse rounded-2xl border-2  bg-white p-0 text-black shadow-sm transition-all duration-300 hover:bg-gray-100 `,
          isSidebarCollapsed ? "left-0" : "left-[20%]"
        )}
      >
        {isSidebarCollapsed ? <PanelRightClose /> : <PanelRightOpen />}
      </Button>

      <section
        className={`absolute top-20 z-50 m-2 border-collapse rounded-2xl border-2 bg-white p-0 text-black shadow-sm transition-all ${isSidebarCollapsed ? "left-0" : "left-[20%]"}`}
      >
        <div className="m-2 flex-col justify-items-center">
          <div className="m-2 rounded-md border-2 shadow-md transition-all duration-200 hover:scale-125">
            {selectedCell ? (
              <Minimize onClick={() => setSelectedCell(0)} className="m-1 size-4" />
            ) : (
              <Maximize onClick={() => setSelectedCell(1)} className="m-1 size-4" />
            )}
          </div>

          <ChevronUp
            className={
              "m-2 size-7 rounded-full border-2 shadow-md transition-all duration-200  hover:scale-125"
            }
            onClick={() => setSelectedCell(Math.max(selectedCell - 1, 1))}
            color={selectedCell === 1 ? "gray" : "black"}
          />
          {[1, 2, 3, 4].map((number) => (
            <div
              key={number}
              onClick={() => setSelectedCell(number)}
              className={`flex h-10 w-12 items-center justify-center rounded-md bg-slate-300 text-xl text-white shadow-md transition duration-100 hover:-translate-y-1 ${
                selectedCell === number ? "bg-blue-600" : "bg-slate-600"
              } cursor-pointer border-2 duration-150 hover:scale-110`}
            >
              <span className="select-none text-[1rem] text-white">{number}</span>
            </div>
          ))}
          <ChevronDown
            className="m-2 size-7 rounded-full border-2 shadow-md transition-all duration-200 hover:scale-125"
            onClick={() => setSelectedCell(Math.min(selectedCell + 1, 4))}
            color={selectedCell === 4 ? "gray" : "black"}
          />
        </div>
      </section>

      <div
        className={`flex flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-0" : "ml-[20%]"
        }`}
      >
        <CenterTab onShow={selectedCell} />
        <div className="w-1/4 border-l bg-gray-100">
          <div className="mb-0 mt-4 flex">
            <section id="1" className="mt-0 w-full rounded-3xl bg-gray-200 p-4">
              <Accordion type="multiple" defaultValue={["prompt"]} className="w-full">
                <AccordionItem value="prompt" className="rounded-3xl bg-white shadow-md">
                  <AccordionTrigger className="rounded-3xl bg-white px-4">
                    生成設定
                  </AccordionTrigger>
                  <AccordionContent className="rounded-b-3xl bg-white px-4">
                    <div className="flex flex-col gap-4">
                      <textarea className="max-h-[9em] min-h-[10em] w-full resize-none rounded-md bg-muted p-2 outline-1 outline-gray-300"></textarea>
                      <Button className="w-full bg-blue-600 text-[1em] text-white">生成する</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="parameters" className="mt-2 rounded-3xl bg-white shadow-md">
                  <AccordionTrigger className="px-4 ">詳細設定</AccordionTrigger>
                  <AccordionContent className="rounded-full bg-white px-4">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">CFG Scale: {cfgScale}</label>
                        <Slider
                          value={[cfgScale]}
                          onValueChange={([value]: number[]) => setCfgScale(value)}
                          min={1}
                          max={20}
                          step={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Steps: {steps}</label>
                        <Slider
                          value={[steps]}
                          onValueChange={([value]: number[]) => setSteps(value)}
                          min={1}
                          max={150}
                          step={1}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
