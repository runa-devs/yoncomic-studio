"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Noto_Sans_JP } from "next/font/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300"],
});
const logo = "logo.svg";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  gender: z.enum(["option-one", "option-two", "option-three"]),
  tag1: z.string().optional(),
  tag2: z.string().optional(),
  tag3: z.string().optional(),
});
export default function Characterform() {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = 2;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      gender: "option-one",
      tag1: "",
      tag2: "",
      tag3: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  const handleNextPage = () => {
    if (currentPage < maxPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 ">
        <section className="m-auto mt-64 flex w-[1000px] flex-col items-center justify-center rounded-2xl bg-gray-200 p-20">
          <span className="items-start space-y-20 self-start border-b-4 border-gray-400 text-2xl">
            キャラクター作成{" "}
          </span>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
              <div className="mt-20 flex flex-col items-center">
                {currentPage === 1 && (
                  <div>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xl">キャラクター名</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormDescription>
                            ここにキャラクター名を追加してください。
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={() => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xl">性別</FormLabel>
                          <RadioGroup {...form.register("gender")}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="option-one" id="option-one" />
                              <Label htmlFor="option-one">男性</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="option-two" id="option-two" />
                              <Label htmlFor="option-two">女性</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="option-three" id="option-three" />
                              <Label htmlFor="option-three">その他</Label>
                            </div>
                          </RadioGroup>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {currentPage === 2 && (
                  <div>
                    <FormField
                      control={form.control}
                      name="tag1"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xl">タグ1</FormLabel>
                          <FormControl>
                            <Input placeholder="タグを入力" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tag2"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xl">タグ2</FormLabel>
                          <FormControl>
                            <Input placeholder="タグを入力" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tag3"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xl">タグ3</FormLabel>
                          <FormControl>
                            <Input placeholder="タグを入力" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div className="self-end">
                  <Button
                    type="button"
                    onClick={handlePreviousPage}
                    className="mr-2 self-end"
                    disabled={currentPage === 1}
                  >
                    戻る
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextPage}
                    className="mr-2 self-end"
                    disabled={currentPage === maxPage}
                  >
                    次へ
                  </Button>
                </div>
                {currentPage === 2 && (
                  <Button type="submit" className="mt-2 gap-2 self-end">
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </section>
      </main>
    </div>
  );
}
