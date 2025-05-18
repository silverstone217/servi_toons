"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/firebase";
import { Content } from "@prisma/client";
import { ref, uploadBytes } from "firebase/storage";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  content: Content;
}

const ModifyImage = ({ content }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [prevImage] = useState(content.image);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!image) {
        toast.error("Ajouter une nouvelle image avant de soumettre !");
        return;
      }

      const coverRef = ref(storage, prevImage);
      await uploadBytes(coverRef, image);

      toast.success("Image a été modifiée avec succès!");

      router.refresh();
      setImage(null);
      //   location.reload();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Oops! Une erreur s'est produite lors de l'ajout!");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div>
      <div className="bg-background border rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-xl font-semibold mb-2">
          Image de la couverture <span className="text-red-500">*</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex flex-col gap-2.5">
            {/* new image */}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    toast.error("Le fichier doit être inférieur à 2 Mo.");
                    e.target.value = "";
                    setImage(null);
                    return;
                  }
                  setImage(file);
                } else {
                  setImage(null);
                }
              }}
              className="w-full md:w-auto"
              required
              disabled={loading}
            />

            {/* btn */}
            <Button onClick={handleSubmit} disabled={loading || !image}>
              {loading ? "En cours..." : "Modifier"}
            </Button>
          </div>

          <div className="w-32 h-44 rounded-lg border bg-secondary flex items-center justify-center relative">
            {image ? (
              <>
                <Image
                  src={URL.createObjectURL(image)}
                  alt="upload image"
                  width={800}
                  height={1000}
                  className="object-cover rounded-lg h-full w-full"
                  priority
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1"
                  type="button"
                  onClick={() => setImage(null)}
                >
                  <X />
                </Button>
              </>
            ) : (
              <Image
                src={prevImage}
                alt="upload image"
                width={800}
                height={1000}
                className="object-cover rounded-lg h-full w-full"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyImage;
