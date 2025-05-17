import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function MyContentPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    redirect("/mes-contenus");
  }

  return <div>MyContentPage --- {id}</div>;
}

export default MyContentPage;
