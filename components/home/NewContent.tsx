"use client";
import { ArrowBigRight } from "lucide-react";
import React, { Suspense } from "react";
import { CardContent } from "./PopularContent";
import { ContentsData } from "@/utils/contentData";

const NewContent = () => {
  return (
    <div
      className="w-full flex flex-col gap-6 pt-8 md:pt-12 px-4 border-y border-y-secondary 
    transition-all duration-500 ease-in-out shadow"
    >
      <div
        className="flex items-center gap-4 flex-wrap transition-all duration-500 ease-in-out
      mx-auto max-w-7xl w-full"
      >
        <h2 className="text-2xl font-bold">Nouveau Contenus</h2>
        <ArrowBigRight className="text-primary" />
      </div>
      {/* contents */}
      <Suspense fallback={<p>chargement...</p>}>
        <div
          className="w-full flex items-start gap-4 xl:gap-4 pb-12 md:pb-14 mx-auto max-w-7xl
          justify-start overflow-x-auto transition-all duration-500 ease-in-out
          xl:grid grid-cols-8 scrollbar-horizontal 
          "
        >
          {ContentsData.slice() // pour ne pas muter l'original
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((content, idx) => (
              <div key={idx} className="shrink-0">
                <CardContent content={content} />
              </div>
            ))}

          {ContentsData.slice(0, 3).map((content, idx) => (
            <div key={idx} className="shrink-0">
              <CardContent content={content} />
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default NewContent;
