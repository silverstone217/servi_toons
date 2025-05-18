"use client";
import { PublishedMyContent } from "@/actions/contentsActions";
import { Switch } from "@/components/ui/switch";
import { CategoriesData } from "@/utils/data";
import { returnDataValue } from "@/utils/functions";
import { Content } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  content: Content;
}

const PublishContent = ({ content }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isPublished, setIsPublished] = useState(content.isPublished);

  useEffect(() => {
    if (isPublished !== content.isPublished) {
      const handleSubmit = async () => {
        setLoading(true);

        try {
          const result = await PublishedMyContent(content.id);
          if (result.error) {
            toast.error(result.message);
            return;
          }

          toast.success(result.message);

          const resData = result.data ? result.data : content;
          content.isPublished = resData.isPublished;

          router.refresh();

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error(
            "Oops! Une erreur s'est produite lors de la publication!"
          );
        } finally {
          setTimeout(() => setLoading(false), 2000);
        }
      };
      handleSubmit();
    }
  }, [content, content.isPublished, isPublished, router]);

  return (
    <div>
      <div className="bg-background border rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-xl font-semibold mb-2">
          {returnDataValue({ value: content.category, data: CategoriesData })}{" "}
          est publié ?
        </h2>

        <div className="flex gap-1.5 items-center">
          <Switch
            checked={isPublished}
            onCheckedChange={setIsPublished}
            disabled={loading}
          />

          {/* y or n */}
          <span className="text-sm text-muted-foreground">
            {isPublished ? "Oui" : "Non"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PublishContent;
