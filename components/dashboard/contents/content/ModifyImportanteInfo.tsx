"use client";
import { categoryType } from "@/types/contentTypes";
import { Content } from "@prisma/client";
import React, { useMemo, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CategoriesData } from "@/utils/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  modifyFirstPart,
  modifyFirstPartType,
} from "@/actions/contentsActions";
import { useRouter } from "next/navigation";

interface Props {
  content: Content;
}

type ModifyContentFormValues = {
  title: string;
  description: string;
  category: categoryType | string;
};

const ModifyImportanteInfo = ({ content }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ModifyContentFormValues>({
    defaultValues: {
      title: content.title ?? "",
      description: content.description ?? "",
      category: content.category ?? "",
    },
  });

  const watchedValues = form.watch();

  const isBtnDisabled = useMemo(() => {
    if (!content) return true;

    if (
      watchedValues.category === content.category &&
      watchedValues.title === content.title &&
      watchedValues.description === content.description
    )
      return true;
    return false;
  }, [content, watchedValues]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = form.getValues();

      // Liste des champs requis
      const requiredFields: {
        key: keyof ModifyContentFormValues;
        label: string;
      }[] = [
        { key: "title", label: "Titre" },
        { key: "description", label: "Description" },
        { key: "category", label: "Catégorie" },
      ];

      for (const field of requiredFields) {
        const value = values[field.key];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          toast.error(`Le champ "${field.label}" est requis.`);
          return;
        }
      }

      const formData: modifyFirstPartType = {
        ...values,
        contentId: content.id,
        category: values.category as categoryType,
      };

      const result = await modifyFirstPart(formData);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      const resData = result.data ?? content;
      if (resData) {
        content.title = resData.title;
        content.description = resData.description;
        content.category = resData.category;
      }

      toast.success(result.message);

      // **RESET DES CHAMPS**
      form.reset({
        title: resData.title,
        description: resData.description,
        category: resData.category,
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
        <div
          className=""
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="bg-background border rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-xl font-semibold mb-2">
              Information Importante <span className="text-red-500">*</span>
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Dragon Ball"
                      maxLength={100}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-sm"
                      placeholder="Décrivez votre contenu ici"
                      rows={5}
                      disabled={loading}
                      maxLength={600}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 600 caractères.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={form.formState.isSubmitting || loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value
                          ? CategoriesData.find((c) => c.value === field.value)
                              ?.label
                          : "Choisir la catégorie"}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CategoriesData.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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

export default ModifyImportanteInfo;
