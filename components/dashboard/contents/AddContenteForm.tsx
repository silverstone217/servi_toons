"use client";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  CategoriesData,
  LanguagesData,
  StatusData,
  TagsData,
  TargetData,
} from "@/utils/data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { categoryType, statusType, targetType } from "@/types/contentTypes";
import { v4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { addContent, newContentType } from "@/actions/contentsActions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

type AddNewContentFormValues = {
  title: string;
  description: string;
  category: categoryType | string;
  tags: string[];
  language: string;
  target: targetType | string;
  status: statusType | string;
  isColored: boolean;
  author: string;
  artist: string;
  edition: string;
  publishedAt: string;
  // image: File | null; // l'image est gérée à part dans ton state, pas dans values
};

export default function AddContenteForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastContentId, setLastContentId] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Utilisation de react-hook-form pour la gestion du formulaire
  const form = useForm<AddNewContentFormValues>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      language: "",
      target: "",
      status: "",
      isColored: false,
      author: "",
      artist: "",
      edition: "",
      publishedAt: "",
      tags: [],
    },
  });

  // Fonction de validation manuelle
  const validateAndSubmit = async () => {
    setLoading(true);
    let imgUrl = "";
    try {
      const values = form.getValues();

      // Liste des champs requis
      const requiredFields: {
        key: keyof AddNewContentFormValues;
        label: string;
      }[] = [
        { key: "title", label: "Titre" },
        { key: "description", label: "Description" },
        { key: "category", label: "Catégorie" },
        { key: "language", label: "Langue" },
        { key: "target", label: "Public ciblé" },
        { key: "status", label: "Status" },
        //   { key: "author", label: "Auteur.e(s)" },
        //   { key: "artist", label: "Artiste(s)" },
        //   { key: "edition", label: "Edition (éditeur)" },
        { key: "publishedAt", label: "Date de publication" },
      ];

      for (const field of requiredFields) {
        const value = values[field.key];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          toast.error(`Le champ "${field.label}" est requis.`);
          return;
        }
      }

      if (!image) {
        toast.error("Ajouter une image avant de soumettre !");
        return;
      }

      if (tags.length < 1) {
        toast.error("Veuillez sélectionner au moins un tag.");
        return;
      }

      //   Add image to firebase
      const imgId = v4().toString().replace(/-/g, "");
      const coverRef = ref(storage, `servi-toons/covers/${imgId}`);
      const coverSnapshot = await uploadBytes(coverRef, image);
      imgUrl = await getDownloadURL(coverSnapshot.ref);

      if (!imgUrl || imgUrl === "") {
        toast.error(
          "Une erreur survenue lors de l'ajout d'image et impossible de continuer!"
        );
        return;
      }

      // On ajoute les tags à values avant soumission
      values.tags = tags;

      const formData: newContentType = {
        ...values,
        publishedAt: new Date(values.publishedAt),
        category: values.category as categoryType,
        target: values.target as targetType,
        status: values.status as statusType,
        image: imgUrl,
      };

      const result = await addContent(formData);

      if (result.error) {
        if (imgUrl) {
          await deleteObject(ref(storage, imgUrl));
        }

        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // **RESET DES CHAMPS**
      form.reset(); // Réinitialise tous les champs du formulaire
      setTags([]); // Vide les tags sélectionnés
      setImage(null);
      router.refresh();

      setLastContentId(result.contentId);
      setTimeout(() => setDialogOpen(true), 1000);

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
    <Form {...form}>
      <div role="form" className="w-full flex flex-col gap-8 min-w-0 min-h-0">
        {/* Section Information Importante */}
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
                    placeholder="Décrivez votre contenu ici"
                    rows={5}
                    disabled={loading}
                    maxLength={600}
                    className="text-sm"
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
        </div>

        {/* Section Information Spécifique */}
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
                        ? TargetData.find((t) => t.value === field.value)?.label
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
                        ? StatusData.find((s) => s.value === field.value)?.label
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
        </div>

        {/* Section Éditoriale */}
        <div className="bg-background border rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="text-xl font-semibold mb-2">Information Éditoriale</h2>

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
            <strong>NB :</strong> Si votre contenu possède plusieurs auteurs ou
            artistes, séparez-les par une virgule. <br />
            {` N'oubliez pas les espaces entre les noms et la(es) virgule(s).`}
          </p>
        </div>

        {/* Section Image */}
        <div className="bg-background border rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="text-xl font-semibold mb-2">
            Image de la couverture <span className="text-red-500">*</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
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
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting || loading}
          >
            Retour
          </Button>
          <Button
            type="button"
            onClick={validateAndSubmit}
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting || loading ? "En cours..." : "Ajouter"}
          </Button>
        </div>

        {/* dialog */}
        <ContentAddedDialog
          open={dialogOpen}
          contentId={lastContentId}
          onClose={() => setDialogOpen(false)}
          onAddAnother={() => {
            form.reset();
            setTags([]);
            setImage(null);
            setLastContentId(null);
          }}
        />
      </div>
    </Form>
  );
}

type ValidateDialogProps = {
  open: boolean;
  contentId: string | null;
  onClose: () => void;
  onAddAnother: () => void;
};
const ContentAddedDialog = ({
  open,
  contentId,
  onClose,
  onAddAnother,
}: ValidateDialogProps) => {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="py-12">
        <DialogHeader>
          <DialogTitle>Contenu ajouté avec succès !</DialogTitle>
          <DialogDescription>
            Que souhaitez-vous faire ensuite ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex  w-full flex-col-reverse gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              router.back();
            }}
          >
            Retour
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              onAddAnother();
            }}
          >
            Ajouter un autre contenu
          </Button>
          <Button
            onClick={() => {
              onClose();
              if (contentId) router.push(`/mes-contenus/${contentId}`);
            }}
            disabled={!contentId}
          >
            Voir le contenu ajouté
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
