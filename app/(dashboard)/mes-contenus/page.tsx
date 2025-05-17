import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import MainMyContentComponent from "./MainMyContentComponent";
import { getMyContents } from "@/actions/contentsActions";

async function MyContentsPAge() {
  const contents = await getMyContents();

  return (
    <div>
      <br />
      {/* New content btn */}
      <Link href={"/mes-contenus/nouveau"}>
        <Button className="max-w-lg xl:max-w-sm w-full px-6 py-6 flex items-center justify-center gap-6">
          <Plus className="shrink-0 size-7" />
          <span>Nouveau contenu</span>
        </Button>
      </Link>

      <br />

      {/* List and filters */}
      <div></div>
      <br />
      {contents.error ? (
        <p className="text-gray-500 text-center mt-2">{contents.message}</p>
      ) : (
        <Suspense fallback={<p>Chargement...</p>}>
          <MainMyContentComponent contents={contents.data} />
        </Suspense>
      )}
    </div>
  );
}

export default MyContentsPAge;
