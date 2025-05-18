"use client";
import { Button } from "@/components/ui/button";
import { Chapter, Content } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface Props {
  content: Content;
  chapters: Chapter[];
}

const ChaptersSection = ({ chapters }: Props) => {
  return (
    <div>
      <div className="bg-background border rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-xl font-semibold mb-2">
          Les Chapitres ({chapters.length.toString().padStart(2, "0")})
        </h2>

        {/* Voire les chapitres */}
        <Link href={"#"}>
          <Button>
            <span>Voire les chapitres</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChaptersSection;
