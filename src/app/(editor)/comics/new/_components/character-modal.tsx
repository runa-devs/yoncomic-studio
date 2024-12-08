"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  accessoryOptions,
  bustSizeOptions,
  clothesOptions,
  colorOptions,
  eyeColors,
  hairColors,
  hairLengthOptions,
  hairStyleOptions,
} from "./character-options";
import { CharacterFormValues, characterSchema } from "./form-schema";

interface CharacterModalProps {
  onSave: (character: CharacterFormValues) => void;
  initialData?: CharacterFormValues;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function CharacterModal({
  onSave,
  initialData,
  isOpen,
  onOpenChange,
  onClose,
}: CharacterModalProps) {
  const characterForm = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      charactername: "",
      gender: "",
      hair_color: "",
      hair_length: "",
      hair_style: "",
      eye_color: "",
      bust_size: "",
      clothes: "",
      accessory: "",
      colors: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        characterForm.reset(initialData);
      } else {
        characterForm.reset({
          charactername: "",
          gender: "",
          hair_color: "",
          hair_length: "",
          hair_style: "",
          eye_color: "",
          bust_size: "",
          clothes: "",
          accessory: "",
          colors: "",
        });
      }
    }
  }, [isOpen, initialData, characterForm]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "キャラクター編集" : "キャラクター設定"}</DialogTitle>
        </DialogHeader>
        <Form {...characterForm}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6"
          >
            <FormField
              control={characterForm.control}
              name="charactername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>キャラクター名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="キャラクター名を入力" />
                  </FormControl>
                  <FormDescription>作成するキャラクター名を入力してください.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={characterForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>性別</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="man">男性</SelectItem>
                      <SelectItem value="woman">女性</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>作成するキャラクターの性別を選択してください.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4">
              <Collapsible>
                <CollapsibleTrigger type="button" className="flex items-center justify-between">
                  <span className="text-sm font-medium">詳細設定</span>
                  <ChevronDown className="size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <FormField
                      control={characterForm.control}
                      name="hair_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>髪の色</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="髪の色を選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hairColors.map(({ value, label, color }) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center">
                                    <div className={`size-4 rounded-full ${color} mr-2`} />
                                    {label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターの髪の色を選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={characterForm.control}
                      name="hair_length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>髪の長さ</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="髪の長さを選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hairLengthOptions.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターの髪の長さを選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={characterForm.control}
                      name="hair_style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ヘアスタイル</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="ヘアスタイルを選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hairStyleOptions.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターのヘアスタイルを選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={characterForm.control}
                      name="eye_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>目の色</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="目の色を選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eyeColors.map(({ value, label, color }) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center">
                                    <div className={`size-4 rounded-full ${color} mr-2`} />
                                    {label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターの目の色を選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={characterForm.control}
                      name="bust_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>胸の大きさ</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="胸の大きさを選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bustSizeOptions.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターの胸の大きさを選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={characterForm.control}
                      name="clothes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>服装</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="服装を選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clothesOptions.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターの服装を選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={characterForm.control}
                      name="accessory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>アクセサリー</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="アクセサリーを選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accessoryOptions.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターのアクセサリーを選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={characterForm.control}
                      name="colors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>色</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="色を選択" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colorOptions.map(({ value, label, color }) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center">
                                    <div className={`size-4 rounded-full ${color} mr-2`} />
                                    {label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            作成するキャラクターの色を選択してください.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                characterForm.handleSubmit((data) => {
                  onSave(data);
                  characterForm.reset();
                  onClose();
                })(e);
              }}
            >
              {initialData ? "更新" : "保存"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
