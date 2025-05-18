"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Chapter, Content, Page } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { isEmptyString } from "@/utils/functions";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  addNewPage,
  addNewPageType,
  getPagesByChapterId,
} from "@/actions/ChaptersActions";
import Image from "next/image";

type Props = { content: Content; chapter: Chapter };

const MainPagesComponent = ({ chapter, content }: Props) => {
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

  const handleVisualize = (imgURL: string) => {
    if (!imgURL) return;

    window.open(imgURL, "_blank");

    // Optionnel : libérer l’URL après un délai (pas toujours nécessaire)
    setTimeout(() => URL.revokeObjectURL(imgURL), 10000);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"outline"} size={"sm"} className="text-[11px]">
          Pages
        </Button>
      </DrawerTrigger>
      <DrawerContent className="min-h-[80svh]">
        <DrawerHeader>
          <DrawerTitle className="capitalize">
            Chapitre {chapter.order} - {chapter.title} (
            {pages.length.toString().padStart(2, "0")})
          </DrawerTitle>
          <DrawerDescription>
            Gerer les pages de votre chapitre.
          </DrawerDescription>
        </DrawerHeader>

        {/* Pages */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full 
        gap-2.5 duration-500 ease-in-out transition-all
        px-2"
        >
          {pages.map((page, idx) => (
            <div
              key={idx}
              className="w-full flex flex-col gap-2 border pb-2 overflow-hidden rounded-lg cursor-pointer"
              onClick={() => handleVisualize(page.imageUrl)}
            >
              {/* image */}
              <Image
                src={page.imageUrl}
                alt="Page"
                priority
                width={800}
                height={1000}
                className="w-full h-56 object-cover"
              />
              {/* order */}
              <p className="text-center text-sm font-medium">
                Page {page.order.toString().padStart(2, "0")}
              </p>

              <div className="flex justify-center items-center py-1.5 w-full">
                {/* delete page btn */}
                <Button variant={"destructive"} className="">
                  Suppimer
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DrawerFooter>
          <AddNewPage chapter={chapter} content={content} />
          <DrawerClose asChild>
            <Button variant="outline">Retour</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MainPagesComponent;

const AddNewPage = ({ chapter, content }: Props) => {
  const [image, setImage] = useState<File | null>(null);

  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVisualize = () => {
    if (!image) return;

    const imageUrl = URL.createObjectURL(image);
    window.open(imageUrl, "_blank");

    // Optionnel : libérer l’URL après un délai (pas toujours nécessaire)
    setTimeout(() => URL.revokeObjectURL(imageUrl), 10000);
  };

  const handleSubmit = async () => {
    let imgUrl = "";
    setLoading(true);
    try {
      if (!image) {
        toast.error("Ajouter une image avant de soumettre !");
        return;
      }

      const intOrder = parseInt(order);

      if (typeof intOrder !== "number") {
        toast.error("Veuillez entrer un nombre pour Order!");
        return;
      }

      //   Add image to firebase
      const imgId = v4().toString().replace(/-/g, "");
      const coverRef = ref(storage, `servi-toons/${chapter.id}/pages/${imgId}`);
      const coverSnapshot = await uploadBytes(coverRef, image);
      imgUrl = await getDownloadURL(coverSnapshot.ref);

      if (!imgUrl || imgUrl === "") {
        toast.error(
          "Une erreur survenue lors de l'ajout d'image et impossible de continuer!"
        );
        return;
      }

      const formData: addNewPageType = {
        imgUrl,
        order: intOrder,
        chapterId: chapter.id,
        contentId: content.id,
      };

      const result = await addNewPage(formData);

      if (result.error) {
        if (imgUrl) {
          await deleteObject(ref(storage, imgUrl));
        }
        toast.error(result.message);

        return;
      }

      toast.success(result.message);

      setImage(null);
      setOrder("");
      router.refresh();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Oops! Une erreur s'est produite lors de l'ajout!");
      if (imgUrl) {
        await deleteObject(ref(storage, imgUrl));
      }
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Nouvelle page du chapitre</DialogTitle>
          <DialogDescription>
            {`Specifier l'image de la page et l'ordre de la page`}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col gap-4">
          {/* image */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2.5">
              {/* new image */}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    //   if (file.size > 2 * 1024 * 1024) {
                    //     toast.error("Le fichier doit être inférieur à 2 Mo.");
                    //     e.target.value = "";
                    //     setImage(null);
                    //     return;
                    //   }
                    setImage(file);
                  } else {
                    setImage(null);
                  }
                }}
                className="w-full max-w-sm md:w-auto"
                required
                disabled={loading}
              />
            </div>

            <Button
              variant={"secondary"}
              disabled={!image}
              onClick={handleVisualize}
            >
              <span>Vizualiser</span>
              <ImageIcon />
            </Button>
          </div>

          {/* Order */}
          <div className="grid w-full  md:w-auto items-center gap-1.5">
            <Label htmlFor="order">Ordre ou numero de la page*</Label>
            <Input
              type="number"
              id="order"
              placeholder="ex: 1 ou 5"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={loading}
              min={1}
              max={10000}
            />
          </div>
        </div>

        <DialogFooter className="py-4 border-t-2">
          <Button
            disabled={loading || !image || isEmptyString(order)}
            onClick={handleSubmit}
          >
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
