"use client";
import SelectComponent from "@/components/SelectComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoryType, statusType, targetType } from "@/types/contentTypes";
import {
  CategoriesData,
  LanguagesData,
  StatusData,
  TagsData,
  TargetData,
} from "@/utils/data";
import { isEmptyString } from "@/utils/functions";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

const AddNewContentForm = () => {
  const [category, setCategory] = useState<categoryType | string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const [language, setLanguage] = useState("");
  const [target, setTarget] = useState<targetType | string>("");
  const [isColored, setIsColored] = useState(false);

  const [publishedAt, setPublishedAt] = useState("");
  const [status, setStatus] = useState<statusType | string>("");
  const [author, setAuthor] = useState("");
  const [artist, setArtist] = useState("");
  const [edition, setEdition] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isButtonDisabled = useMemo(() => {
    if (
      loading ||
      isEmptyString(title) ||
      isEmptyString(description) ||
      isEmptyString(language) ||
      image === null ||
      isEmptyString(target) ||
      tags.length < 1 ||
      isEmptyString(status) ||
      !category
    ) {
      return true;
    }
    return false;
  }, [
    description,
    image,
    language,
    loading,
    status,
    tags.length,
    target,
    title,
    category,
  ]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!image) {
        toast.error("Ajouter une image avant de soumettre!");
        return;
      }
      setLoading(true);
    } catch (error) {
      console.log(error);
      toast.error("Oops! Une erreur survenue lors de l'ajout!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-6
    transition-all duration-500 ease-in-out
    "
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* info importa */}
      <div
        className="w-full flex flex-col gap-4 p-4 border-2 rounded-lg 
      transition-all duration-500 ease-in-out"
      >
        <h2 className="text-lg font-medium">Information Imporatante *</h2>

        {/* title */}
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="title">Titre</Label>
          <Input
            type="text"
            id="title"
            placeholder="ex: Dragon ball"
            autoComplete="title"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength={100}
            required
          />
        </div>

        {/* description */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Description </Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Décrivez votre contenu ici"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            maxLength={600}
            required
            className="w-full text-sm font-medium min-h-16 max-h-36"
            autoComplete="description"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        {/* category */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="category">Categorie </Label>
          <SelectComponent
            isRequired
            isDisabled={loading}
            value={category}
            name="category"
            data={CategoriesData}
            onChangeValue={setCategory}
            placeholder="Choisir le type de contenu"
          />
        </div>
      </div>

      {/* specfique */}
      <div
        className="w-full flex flex-col gap-4 p-4 border-2 rounded-lg 
      transition-all duration-500 ease-in-out"
      >
        <h2 className="text-lg font-medium">Information Specifique *</h2>
        {/* Tags */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="tags">Tags(Genre)</Label>
          <div className="flex w-full items-center gap-1.5 flex-wrap">
            {TagsData.map((tg, idx) => (
              <Button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => {
                  setTags((prevTags) => {
                    if (prevTags.includes(tg.value)) {
                      // Supprimer le tag existant
                      return prevTags.filter((t) => t !== tg.value);
                    } else if (prevTags.length < 5) {
                      // Ajouter un nouveau tag seulement si la limite n'est pas atteinte
                      return [...prevTags, tg.value];
                    }
                    // Retourner les tags inchangés si la limite est atteinte
                    return prevTags;
                  });
                }}
                variant={tags.includes(tg.value) ? "default" : "secondary"}
              >
                {tg.label}
              </Button>
            ))}
          </div>

          <p
            className="
          text-xs
          text-gray-500
        "
          >
            {"Vous ne pouvez pas ajouter plus de 5 tags(genres)"}
          </p>
        </div>

        {/* language */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="language">Langue</Label>
          <SelectComponent
            isRequired
            isDisabled={loading}
            value={language}
            name="language"
            data={LanguagesData}
            onChangeValue={setLanguage}
            placeholder="Choisir la langue"
          />
        </div>

        {/* target */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="target">Public ciblé</Label>
          <SelectComponent
            isRequired
            isDisabled={loading}
            value={target}
            name="target"
            data={TargetData}
            onChangeValue={setTarget}
            placeholder="Choisir la cible(le Public)"
          />
        </div>

        {/* status */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="status">Status</Label>
          <SelectComponent
            isRequired
            isDisabled={loading}
            value={status}
            name="status"
            data={StatusData}
            onChangeValue={setStatus}
            // placeholder="Choisir la cible(le Public)"
          />
        </div>

        {/* isColored */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="status">Est colorié? </Label>
          <div className="flex items-center gap-4">
            {/* yes */}
            <Button
              variant={isColored ? "default" : "outline"}
              onClick={() => setIsColored(true)}
              type="button"
            >
              Oui
            </Button>

            {/* no */}
            <Button
              variant={!isColored ? "default" : "outline"}
              onClick={() => setIsColored(false)}
              type="button"
            >
              Non
            </Button>
          </div>
        </div>
      </div>

      {/* Edition et auteur */}
      <div
        className="w-full flex flex-col gap-4 p-4 border-2 rounded-lg 
      transition-all duration-500 ease-in-out"
      >
        <h2 className="text-lg font-medium">Information Edititoriale</h2>

        {/* author */}
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="author">Auteur.e(s)</Label>
          <Input
            type="text"
            id="author"
            placeholder="ex: akira toriyama"
            autoComplete="author"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
        </div>

        {/* artist */}
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="artist">Artiste(s)</Label>
          <Input
            type="text"
            id="artist"
            placeholder="ex: akira toriyama"
            autoComplete="artiste"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
        </div>

        {/* edition */}
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="edition">Edition(editeur)</Label>
          <Input
            type="text"
            id="edition"
            placeholder="ex: shueisha"
            autoComplete="edition"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            disabled={loading}
            maxLength={100}
          />
        </div>

        {/* PublishedAt */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="publishedAt">Date de publication</Label>
          <Input
            type="date"
            id="publishedAt"
            value={publishedAt}
            disabled={loading}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full text-sm font-medium"
            autoComplete="publishedAt"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        <p
          className="
          text-xs
          text-gray-500
        "
        >
          <strong>NB:</strong>{" "}
          {
            "Si votre contenu possede plusieurs auteurs ou artistes, ajoutez les et separez les par une virgule ex: Makx74 , jim78"
          }
          <br />
          {"N'oubliez pas les espaces entres les noms et la(es) virgule(s)"}
        </p>
      </div>

      <div
        className="w-full flex flex-col gap-4 p-4 border-2 rounded-lg 
      transition-all duration-500 ease-in-out"
      >
        <h2 className="text-lg font-medium">Image de la couvertue *</h2>
        <div className="flex md:flex-row flex-col w-full gap-6 items-center md:items-start">
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const file = files[0];
                const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo en octets

                if (file.size > maxSizeInBytes) {
                  toast.error("Le fichier doit être inférieur à 2 Mo.");
                  e.target.value = ""; // reset input pour forcer re-sélection
                  setImage(null);
                  return;
                }

                setImage(file);
              } else {
                setImage(null);
              }
            }}
            disabled={loading}
            required
            className="flex-1 text-sm font-medium"
            autoComplete="image"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* view img */}
          <div className="w-32 h-44 rounded-lg border bg-secondary relative">
            {image && (
              <Image
                src={URL.createObjectURL(image)}
                alt="upload image"
                priority
                width={600}
                height={800}
                className="object-cover w-full h-full brightness-90 rounded-lg"
              />
            )}
            {/* absolute btn */}
            {image && (
              <Button
                variant={"destructive"}
                className="absolute top-1 right-1"
                size={"icon"}
                type="button"
                onClick={() => setImage(null)}
              >
                <X />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* btns */}
      <div
        className="w-full flex  gap-6 flex-wrap p-4 border-2 rounded-lg 
      transition-all duration-500 ease-in-out"
      >
        {/* cancel */}
        <Button
          type="button"
          variant={"outline"}
          onClick={() => router.back()}
          disabled={loading}
        >
          Retour
        </Button>
        {/* submit btn */}
        <Button type="submit" disabled={isButtonDisabled}>
          {loading ? "En cours..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};

export default AddNewContentForm;
