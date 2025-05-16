"use client";
import { ContentsData } from "@/utils/contentData";
import { ArrowBigRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React, { Suspense } from "react";

const NewContents = () => {
  return (
    <div
      className="w-full flex flex-col gap-6 pt-8 md:pt-12 px-4 bg-gray-100 dark:bg-gray-900
    border-y border-y-secondary transition-all duration-500 ease-in-out shadow"
    >
      <div
        className="flex items-center gap-4 flex-wrap transition-all duration-500 ease-in-out
      mx-auto max-w-7xl justify-start w-full
      "
      >
        <h2 className="text-2xl font-bold">Nouveaux Contenus </h2>
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
          {ContentsData.map((content, idx) => (
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

export default NewContents;

type CardProps = {
  title: string;
  slug: string;
  image: StaticImageData;
  description: string;
  category: string;
  tags: string[];
  target: string;
  authorId: string;
  language: string;
};

export const CardContent = ({ content }: { content: CardProps }) => {
  return (
    <div className="xl:w-full w-36 flex flex-col gap-4 group transition-all duration-500 ease-in-out">
      {/* image */}
      <div className="w-full h-52 flex overflow-hidden rounded-lg relatif">
        <Image
          src={content.image}
          priority
          alt={content.title}
          width={800}
          height={850}
          className="w-full h-full object-cover rounded-lg group-hover:scale-125 cursor-pointer
                  transition-all duration-500 ease-in-out
                  "
        />
      </div>

      {/* title */}
      <div className="flex flex-col items-start">
        <h4
          className="capitalize text-xs line-clamp-2 cursor-pointer
                  transition-all duration-500 ease-in-out"
        >
          {content.title}
        </h4>
      </div>
    </div>
  );
};
