import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function MyContentsPAge() {
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
      <div>
        <h2>Mes contenus</h2>
      </div>
    </div>
  );
}

export default MyContentsPAge;
