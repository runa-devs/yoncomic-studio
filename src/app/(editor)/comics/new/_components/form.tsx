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
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/hono";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dices, Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterCard } from "./character-card";
import { CharacterModal } from "./character-modal";
import { CharacterFormValues, FormSchema, FormValues } from "./form-schema";

export function CharacterForm() {
  const [characters, setCharacters] = useState<CharacterFormValues[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      characters: [],
      story: "",
    },
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  async function onSubmit(data: FormValues) {
    setIsPending(true);
    if (isPending) return;

    try {
      const res = await client.api.comics.new.$post({ json: data });
      if (res.status === 200) {
        const { id } = await res.json();
        router.push(`/comics/${id}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsPending(false);
    }
  }

  const handleDeleteCharacter = (index: number) => {
    const newCharacters = characters.filter((_, i) => i !== index);
    setCharacters(newCharacters);
    form.setValue("characters", newCharacters);
  };

  const handleAddCharacter = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-muted">
      <div className="w-2/3 rounded-3xl bg-background p-8 shadow-lg">
        <h1 className="text-xl font-bold">マンガ作成</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">キャラクター設定</h2>
              <div className="grid grid-cols-2 gap-4">
                {characters.map((character, index) => (
                  <CharacterCard
                    key={index}
                    character={character}
                    index={index}
                    onEdit={() => {
                      setEditingIndex(index);
                      setIsModalOpen(true);
                    }}
                    onDelete={() => {
                      handleDeleteCharacter(index);
                    }}
                  />
                ))}
                {characters.length < 2 && (
                  <Button
                    variant="outline"
                    className="flex h-32 w-full flex-col items-center justify-center"
                    onClick={handleAddCharacter}
                  >
                    <Plus className="mb-2 size-8" />
                    <span>キャラクターを追加</span>
                  </Button>
                )}
                <CharacterModal
                  onSave={(character) => {
                    if (editingIndex !== null) {
                      const newCharacters = [...characters];
                      newCharacters[editingIndex] = character;
                      setCharacters(newCharacters);
                      form.setValue("characters", newCharacters);
                    } else {
                      setCharacters([...characters, character]);
                      form.setValue("characters", [...characters, character]);
                    }
                  }}
                  initialData={editingIndex !== null ? characters[editingIndex] : undefined}
                  isOpen={isModalOpen}
                  onOpenChange={setIsModalOpen}
                  onClose={handleModalClose}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center justify-between">
                      <p>ストーリー(任意)</p>
                      <Button variant="outline" size="sm" disabled>
                        <Dices className="size-4" />
                        ランダム
                      </Button>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="わからない場合は空欄でOK"
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormDescription>
                    作成するマンガのストーリーを入力してください。
                    <br />
                    主語と動作、ポーズをはっきりさせると精度が上がります。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  作成中...
                </>
              ) : (
                "作成"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
