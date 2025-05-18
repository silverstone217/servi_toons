import { getUser } from "@/actions/authAction";
import {
  getMyContentByID,
  getMyChpatersContentByID,
} from "@/actions/contentsActions";
import MainChapters from "@/components/dashboard/contents/content/chapters/MainChapters";
import { NotPermitted } from "@/components/NotAuthorized";
import { Content } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function ChaptersPage({ params }: Props) {
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
      <MainChapters chapters={chapters} content={myContent} />
    </div>
  );
}

export default ChaptersPage;
