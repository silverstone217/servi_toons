import { getUser } from "@/actions/authAction";
import {
  getMyChpatersContentByID,
  getMyContentByID,
} from "@/actions/contentsActions";
import ChaptersSection from "@/components/dashboard/contents/content/ChaptersSection";
import DangerZone from "@/components/dashboard/contents/content/DangerZone";
import ModifyEditorialInfo from "@/components/dashboard/contents/content/ModifyEditorialInfo";
import ModifyImage from "@/components/dashboard/contents/content/ModifyImage";
import ModifyImportanteInfo from "@/components/dashboard/contents/content/ModifyImportanteInfo";
import ModifySpecificInformations from "@/components/dashboard/contents/content/ModifySpecificInformations";
import PublishContent from "@/components/dashboard/contents/content/PublishContent";
import { NotPermitted } from "@/components/NotAuthorized";
import { Content } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function MyContentPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser();

  if (!id || !user) {
    redirect("/mes-contenus");
  }

  const content = await getMyContentByID(id);
  const myContent = content.data as Content;

  if (myContent.userId !== user.id) {
    return <NotPermitted />;
  }

  const chapters = (await getMyChpatersContentByID(myContent.id)).data;

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Publish Yes or Not */}
        <PublishContent content={myContent} />

        {/* image */}
        <ModifyImage content={myContent} />

        {/* Title and Impoprt INfo */}
        <ModifyImportanteInfo content={myContent} />

        {/*  Special INfo */}
        <ModifySpecificInformations content={myContent} />

        {/* EDITION info */}
        <ModifyEditorialInfo content={myContent} />

        {/* Chapters */}
        <ChaptersSection content={myContent} chapters={chapters} />

        {/* Danger zone */}
        <DangerZone content={myContent} />
      </div>
    </div>
  );
}

export default MyContentPage;
