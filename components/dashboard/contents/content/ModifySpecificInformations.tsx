"use client";
import {
  modifySecondPart,
  modifySecondPartType,
} from "@/actions/contentsActions";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { statusType, targetType } from "@/types/contentTypes";
import { LanguagesData, StatusData, TagsData, TargetData } from "@/utils/data";
import { areArraysEqual } from "@/utils/functions";
import { Content } from "@prisma/client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ModifyContentFormValues = {
  tags: string[];
  language: string;
  target: targetType | string;
  status: statusType | string;
  isColored: boolean;
};

interface Props {
  content: Content;
}

const ModifySpecificInformations = ({ content }: Props) => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(content.tags ?? []);
  const router = useRouter();

  // Utilisation de react-hook-form pour la gestion du formulaire
  const form = useForm<ModifyContentFormValues>({
    defaultValues: {
      language: content.language ?? "",
      target: content.target ?? "",
      status: content.status ?? "",
      isColored: content.isColored ?? false,
      tags: [],
    },
  });

  const watchedValues = form.watch();

  const isBtnDisabled = useMemo(() => {
    if (!content) return true;

    if (
      watchedValues.status === content.status &&
      watchedValues.isColored === content.isColored &&
      watchedValues.language === content.language &&
      watchedValues.target === content.target &&
      areArraysEqual(tags, content.tags)
    )
      return true;
    return false;
  }, [content, watchedValues, tags]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = form.getValues();

      // Liste des champs requis
      const requiredFields: {
        key: keyof ModifyContentFormValues;
        label: string;
      }[] = [
        { key: "language", label: "Langue" },
        { key: "target", label: "Public ciblé" },
        { key: "status", label: "Status" },
      ];

      for (const field of requiredFields) {
        const value = values[field.key];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          toast.error(`Le champ "${field.label}" est requis.`);
          return;
        }
      }
      values.tags = tags;

      const formData: modifySecondPartType = {
        ...values,
        contentId: content.id,
        language: values.language,
        status: values.status as statusType,
        target: values.target as targetType,
      };

      const result = await modifySecondPart(formData);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      const resData = result.data ?? content;
      if (resData) {
        content.isColored = resData.isColored;
        content.language = resData.language;
        content.status = resData.status;
        content.target = resData.target;
        content.tags = resData.tags;
      }

      toast.success(result.message);

      // **RESET DES CHAMPS**
      form.reset({
        language: resData.language,
        isColored: resData.isColored,
        status: resData.status,
        target: resData.target,
      });
      router.refresh();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Impossible d'effectuer cette action");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div>
      <Form {...form}>
        <div className="">
          <div className="bg-background border rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-xl font-semibold mb-2">
              Information Spécifique <span className="text-red-500">*</span>
            </h2>

            {/* Tags */}
            <FormItem>
              <FormLabel>Tags (Genre)</FormLabel>
              <div className="flex flex-wrap gap-2">
                {TagsData.map((tg, idx) => (
                  <Badge
                    key={idx}
                    variant={tags.includes(tg.value) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => {
                      setTags((prev) =>
                        prev.includes(tg.value)
                          ? prev.filter((t) => t !== tg.value)
                          : prev.length < 5
                          ? [...prev, tg.value]
                          : prev
                      );
                    }}
                  >
                    {tg.label}
                    {tags.includes(tg.value) && <X className="ml-1 w-3 h-3" />}
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Vous ne pouvez pas ajouter plus de 5 tags (genres).
              </FormDescription>
            </FormItem>

            {/* Langue */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langue</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={form.formState.isSubmitting || loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value
                          ? LanguagesData.find((l) => l.value === field.value)
                              ?.label
                          : "Choisir la langue"}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LanguagesData.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Public ciblé */}
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public ciblé</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={form.formState.isSubmitting || loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value
                          ? TargetData.find((t) => t.value === field.value)
                              ?.label
                          : "Choisir la cible"}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TargetData.map((target) => (
                        <SelectItem key={target.value} value={target.value}>
                          {target.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Statut */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={form.formState.isSubmitting || loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value
                          ? StatusData.find((s) => s.value === field.value)
                              ?.label
                          : "Choisir le statut"}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {StatusData.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Est colorié ? */}
            <FormField
              control={form.control}
              name="isColored"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>Est colorié ?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value ? "Oui" : "Non"}
                  </span>
                </FormItem>
              )}
            />

            {/* btn */}
            <div className="w-full flex items-center justify-end border-t-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={loading || isBtnDisabled}
              >
                {loading ? "En cours..." : "Modifier"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ModifySpecificInformations;
