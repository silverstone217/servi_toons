"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CategoriesData, LanguagesData, TagsData } from "@/utils/data";
import { capitalizeFirstLetter, returnDataValue } from "@/utils/functions";
import { Content } from "@prisma/client";
import { Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  contents: Content[];
};

const PopularTopContent = ({ contents }: Props) => {
  const [index, setIndex] = useState(0);

  const handleNext = useCallback(() => {
    setIndex((prevIndex) =>
      prevIndex === contents.length - 1 ? 0 : prevIndex + 1
    );
  }, [contents.length]);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const content = useMemo(() => contents[index], [contents, index]);

  if (contents.length < 1) return null;

  return (
    <section className="relative w-full ">
      <div className="relative h-[400px] md:h-[450px] w-full overflow-hidden shadow-lg">
        {/* Background image */}
        <Image
          src={content.image}
          alt={content.title}
          priority
          fill
          className="object-cover brightness-90 w-full"
        />

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 
        to-black/40 p-6 flex flex-col justify-between text-white
        px-4 sm:px-6 lg:px-8
        "
        >
          {/* Header */}
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight hidden">
              Les plus Populaires
            </h2>
          </div>

          {/* Content info */}
          <Link
            href="#"
            className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8
             cursor-pointer hover:opacity-80 transition-opacity duration-300 "
          >
            {/* Thumbnail */}
            <div className="relative w-32 md:w-40 h-44 md:h-56 rounded-lg shadow-lg flex-shrink-0 overflow-hidden">
              <Image
                src={content.image}
                alt={content.title}
                priority
                fill
                className="object-cover"
              />
            </div>

            {/* Text info */}
            <div className="flex-1 flex flex-col gap-4 max-w-full">
              {/* Title */}
              <h3
                className="text-3xl md:text-2xl font-extrabold capitalize
              line-clamp-3 md:line-clamp-2 text-white tracking-tight"
              >
                {content.title}
              </h3>

              {/* Category & Language */}
              <div className="flex flex-wrap gap-4 text-sm font-semibold capitalize text-blue-300">
                <span>
                  {returnDataValue({
                    data: CategoriesData,
                    value: content.category,
                  })}
                </span>
                <span>
                  {returnDataValue({
                    data: LanguagesData,
                    value: content.language,
                  })}
                </span>
              </div>

              {/* Description */}
              <p className="hidden md:block text-sm text-gray-300 line-clamp-5 max-w-lg">
                {capitalizeFirstLetter(content.description)}
              </p>

              {/* Tags */}
              <div className="hidden md:flex flex-wrap gap-2 text-xs font-medium text-gray-400 max-w-lg">
                {content.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 rounded-full px-3 py-1 select-none"
                  >
                    {returnDataValue({ value: tag, data: TagsData })}
                  </span>
                ))}
              </div>

              {/* Author & Year */}
              <p className="text-sm font-medium text-gray-200 capitalize">
                {content.author && <span>{content.author}, </span>}
                <span>{content.publishedAt.getFullYear()}</span>
              </p>
            </div>
          </Link>

          {/* Navigation dots */}
          <nav className="flex justify-center gap-3 mt-4">
            {contents.map((_, idx) => (
              <Button
                key={idx}
                variant={index === idx ? "default" : "ghost"}
                size="icon"
                aria-label={`Afficher le contenu numéro ${idx + 1}`}
                onClick={() => setIndex(idx)}
                className={cn(
                  "w-3 h-3 rounded-full p-0",
                  index === idx ? "bg-white" : "bg-white/40"
                )}
              >
                <Circle className="w-3 h-3" />
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PopularTopContent;
