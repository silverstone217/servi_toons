"use client";
import React, { useEffect, useState } from "react";
import { Chapter, Content, Page } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash } from "lucide-react";
import Image from "next/image";
import { CategoriesData, LanguagesData } from "@/utils/data";
import { isEmptyString, returnDataValue } from "@/utils/functions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/UserAuth";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  addNewChap,
  addNewChapType,
  deleteChapByIds,
  getPagesByChapterId,
  ModChapType,
  modifyChap,
} from "@/actions/ChaptersActions";
import MainPagesComponent from "./pages/MainPagesComponent";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface Props {
  content: Content;
  chapters: Chapter[];
}

const MainChapters = ({ content, chapters }: Props) => {
  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Add new chap btn */}
      {/* <div className="w-full flex items-center justify-end">
        <Button className="px-8 flex items-center gap-2.5">
          <Plus className="size-6 shrink-0" />
          <span>Nouveau chapitre</span>
        </Button>
      </div> */}

      {/* section div */}
      <div className="grid md:grid-cols-4 xl:grid-cols-5 gap-4 items-start">
        {/* content Info */}
        <div className="col-span-1 flex flex-col gap-3">
          {/* image */}
          <div className="md:w-full w-40 mx-auto h-56 rounded-lg">
            <Image
              src={content.image}
              alt="content image"
              priority
              width={800}
              height={1000}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          {/* infos */}

          <div className="flex flex-col gap-2">
            {/* title */}
            <h2 className="text-sm font-medium text-center md:text-left line-clamp-4">
              {content.title}
            </h2>

            {/* category and language */}
            <div
              className="flex items-center gap-4 md:justify-start
            justify-center text-[10px] opacity-75"
            >
              <span>
                {returnDataValue({
                  value: content.category,
                  data: CategoriesData,
                })}
              </span>
              <span className="text-primary">
                {returnDataValue({
                  value: content.language,
                  data: LanguagesData,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* chapitres list */}
        <div className="col-span-1 xl:col-span-4 md:col-span-3 md:h-[60svh] bg-background rounded-lg p-4">
          {/* top */}
          <div className="pb-4 py-2 border-b-2 flex items-center justify-between gap-2.5">
            <h2 className="text-xl font-semibold ">
              Les Chapitres ({chapters.length.toString().padStart(2, "0")})
            </h2>

            {/* btn new */}
            <AddNewChapter chapters={chapters} content={content} />
          </div>

          {/* list chaps */}
          <div className="flex flex-col w-full py-2 gap-4">
            {chapters.map((chapter, idx) => (
              <ChapterCardItem chapter={chapter} content={content} key={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChapters;

// Card Chap
const ChapterCardItem = ({
  chapter,
  content,
}: {
  chapter: Chapter;
  content: Content;
}) => {
  return (
    <div className="w-full grid grid-cols-2 gap-2 py-2 border-b-[0.2px] border-b-gray-300 dark:border-b-gray-700">
      {/* chap and date */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">
          Chap. {chapter.order.toString().padStart(2, "0")}
        </p>
        <p className="text-[10px] text-gray-600">
          {chapter.createdAt.toLocaleDateString("fr-FR", {})}
        </p>
      </div>

      {/* edit, delete and pages */}

      <div className="flex justify-end items-center gap-1">
        {/* pages */}
        <MainPagesComponent chapter={chapter} content={content} />

        {/* modify */}
        <EditChapter chapter={chapter} content={content} />
        {/* delete */}
        <DeleteChapter chapter={chapter} content={content} />
      </div>
    </div>
  );
};

// New chap form
const AddNewChapter = ({ content }: Props) => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const user = useCurrentUser();

  const handleAddNewChap = async () => {
    setLoading(true);
    try {
      const intOrder = parseFloat(order);

      if (typeof intOrder !== "number") {
        toast.error("Veuillez entrer un nombre pour Order!");
        return;
      }

      const formData: addNewChapType = {
        contentId: content.id,
        title: title.trim().toLowerCase(),
        order: intOrder,
      };

      const result = await addNewChap(formData);

      if (result?.error) {
        toast.error(result.message);
        return;
      }

      toast.success("Chapitre ajouté!");
      setTitle("");
      setOrder("");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Oops! Une erreur est survenue!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" flex items-center gap-2.5">
          <Plus className="size-6 shrink-0" />
          <span className="hidden md:block">Nouveau chapitre</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau chapitre</DialogTitle>
          <DialogDescription>
            Tous les champs ayant un <strong>*</strong> sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 mt-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddNewChap();
          }}
        >
          {/* Title */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input
              type="text"
              id="title"
              placeholder="ex: La fin de temps"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              maxLength={30}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Order */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="order">Ordre ou numero *</Label>
            <Input
              type="text"
              id="order"
              placeholder="ex: 0 ou 1.5"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={loading}
            />
          </div>

          <DialogFooter className="border-t-2 w-full pt-4">
            <DialogClose asChild>
              <Button type="button" disabled={loading} variant={"secondary"}>
                Annuler
              </Button>
            </DialogClose>
            {/* submit */}
            <Button type="submit">
              {" "}
              {loading ? "En cours... " : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit chap form
const EditChapter = ({ chapter }: { content: Content; chapter: Chapter }) => {
  const [title, setTitle] = useState(chapter.title ?? "");
  const [order, setOrder] = useState(chapter.order.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const user = useCurrentUser();

  const handleAddNewChap = async () => {
    setLoading(true);
    try {
      const intOrder = parseFloat(order);

      if (typeof intOrder !== "number") {
        toast.error("Veuillez entrer un nombre pour Order!");
        return;
      }

      const formData: ModChapType = {
        contentId: chapter.contentId,
        title: title.trim().toLowerCase(),
        order: intOrder,
        chapterId: chapter.id,
      };

      const result = await modifyChap(formData);

      if (result?.error) {
        toast.error(result.message);
        return;
      }

      toast.success("Chapitre modifié!");

      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Oops! Une erreur est survenue!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" flex items-center gap-2.5" size={"sm"}>
          <SquarePen className="shrink-0" />
          <span className="sr-only">Modifier le chapitre</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le chapitre</DialogTitle>
          <DialogDescription>
            Tous les champs ayant un <strong>*</strong> sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 mt-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddNewChap();
          }}
        >
          {/* Title */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input
              type="text"
              id="title"
              placeholder="ex: La fin de temps"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              maxLength={30}
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Order */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="order">Ordre ou numero *</Label>
            <Input
              type="text"
              id="order"
              placeholder="ex: 0 ou 1.5"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              defaultValue={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={loading}
            />
          </div>

          <DialogFooter className="border-t-2 w-full pt-4">
            <DialogClose asChild>
              <Button type="button" disabled={loading} variant={"secondary"}>
                Annuler
              </Button>
            </DialogClose>
            {/* submit */}
            <Button
              type="submit"
              disabled={
                loading ||
                isEmptyString(order) ||
                (order === chapter.order.toString() && title === chapter.title)
              }
            >
              {" "}
              {loading ? "En cours... " : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// delete chap
const DeleteChapter = ({
  content,
  chapter,
}: {
  content: Content;
  chapter: Chapter;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const user = useCurrentUser();

  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      const pages = await getPagesByChapterId(chapter.id);
      setPages(pages);
    };

    fetchPages();
    const interval = setInterval(fetchPages, 5000); // toutes les 5 secondes

    return () => clearInterval(interval);
  }, [chapter.id]);

  const handleDeleteChap = async () => {
    setLoading(true);
    try {
      const result = await deleteChapByIds(content.id, chapter.id);

      if (result?.error) {
        toast.error(result.message);
        return;
      }

      if (pages.length > 0) {
        for (const pg of pages) {
          const imgRef = ref(storage, pg.imageUrl);
          await deleteObject(imgRef);
        }
      }

      toast.success(result.message);

      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Oops! Une erreur est survenue!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          className=" flex items-center gap-2.5"
          size={"sm"}
        >
          <Trash className="shrink-0" />
          <span className="sr-only">Supprimer le chapitre</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le chapitre</DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment supprimer ce chapitre, cette action sera
            irreversible.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 mt-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteChap();
          }}
        >
          <DialogFooter className="border-t-2 w-full pt-4">
            <DialogClose asChild>
              <Button type="button" disabled={loading} variant={"secondary"}>
                Annuler
              </Button>
            </DialogClose>
            {/* submit */}
            <DialogClose asChild>
              <Button type="submit" disabled={loading} variant={"destructive"}>
                {loading ? "En cours... " : "Supprimer"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
