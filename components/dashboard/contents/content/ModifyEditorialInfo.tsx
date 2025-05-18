"use client";
import { Content } from "@prisma/client";
import React, { useMemo, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  modifyThirdPart,
  modifyThirdPartType,
} from "@/actions/contentsActions";
import { useRouter } from "next/navigation";
import { convertDateToString } from "@/utils/functions";

interface Props {
  content: Content;
}

type ModifyContentFormValues = {
  author: string;
  artist: string;
  edition: string;
  publishedAt: string;
};

const ModifyEditorialInfo = ({ content }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ModifyContentFormValues>({
    defaultValues: {
      author: content.author ?? "",
      artist: content.artist ?? "",
      edition: content.edition ?? "",
      publishedAt: content.publishedAt
        ? convertDateToString(content.publishedAt)
        : "",
    },
  });

  const watchedValues = form.watch();

  const isBtnDisabled = useMemo(() => {
    if (!content) return true;

    // Normalisation : transforme undefined en chaîne vide
    const author = content.author ?? "";
    const artist = content.artist ?? "";
    const edition = content.edition ?? "";

    const watchedAuthor = watchedValues.author ?? "";
    const watchedArtist = watchedValues.artist ?? "";
    const watchedEdition = watchedValues.edition ?? "";

    // Pour la date, on gère aussi le cas undefined ou null
    const contentDate = content.publishedAt
      ? new Date(content.publishedAt).toLocaleDateString()
      : "";
    const watchedDate = watchedValues.publishedAt
      ? new Date(watchedValues.publishedAt).toLocaleDateString()
      : "";

    // Retourne true si TOUTES les valeurs sont identiques (donc bouton désactivé)
    return (
      watchedAuthor === author &&
      watchedArtist === artist &&
      watchedEdition === edition &&
      watchedDate === contentDate
    );
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
        // { key: "author", label: "Auteur.e(s)" },
        // { key: "artist", label: "Artiste(s)" },
        // { key: "edition", label: "Edition (éditeur)" },
        { key: "publishedAt", label: "Date de publication" },
      ];

      for (const field of requiredFields) {
        const value = values[field.key];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          toast.error(`Le champ "${field.label}" est requis.`);
          return;
        }
      }

      const formData: modifyThirdPartType = {
        ...values,
        contentId: content.id,
        publishedAt: new Date(values.publishedAt),
      };

      const result = await modifyThirdPart(formData);

      if (result.error) {
        toast.error(result.message);
        return;
      }

      const resData = result.data ?? content;
      if (resData) {
        content.author = resData.author;
        content.description = resData.description;
        content.category = resData.category;
        content.publishedAt = resData.publishedAt;
      }

      toast.success(result.message);

      // **RESET DES CHAMPS**
      form.reset({
        author: resData.author ?? "",
        artist: resData.artist ?? "",
        edition: resData.edition ?? "",
        publishedAt: convertDateToString(content.publishedAt) ?? "",
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
              Information Éditoriale
            </h2>

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur.e(s)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Akira Toriyama"
                      maxLength={100}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artiste(s)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Akira Toriyama"
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
              name="edition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edition (éditeur)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Shueisha"
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
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de publication</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-gray-500">
              <strong>NB :</strong> Si votre contenu possède plusieurs auteurs
              ou artistes, séparez-les par une virgule. <br />
              {` N'oubliez pas les espaces entre les noms et la(es) virgule(s).`}
            </p>

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

export default ModifyEditorialInfo;
