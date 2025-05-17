import { getUser } from "@/actions/authAction";
import { getMyContentByID } from "@/actions/contentsActions";
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

  if (!id) {
    redirect("/mes-contenus");
  }

  const content = await getMyContentByID(id);
  const myContent = content.data;

  return (
    <div>
      MyContentPage
      <p>
        <span>content ID : --- {id}</span>
        <br />
        <span>
          User ID: {user?.id} / ContentUSERID : {myContent?.userId}
        </span>
      </p>
    </div>
  );
}

export default MyContentPage;
