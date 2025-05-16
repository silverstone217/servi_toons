"use client";
import { cn } from "@/lib/utils";
import { ContentsData } from "@/utils/contentData";
import { CategoriesData, LanguagesData, TagsData } from "@/utils/data";
import { capitalizeFirstLetter, returnDataValue } from "@/utils/functions";
// import { ArrowBigRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const PopularTopContent = () => {
  const [index, setIndex] = useState(0);

  const handleNext = useCallback(() => {
    setIndex((prevIndex) =>
      prevIndex === ContentsData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const content = useMemo(() => ContentsData[index], [index]);

  if (ContentsData.length < 1) {
    return null;
  }

  return (
    <section>
      <div
        className="relative h-[400px] md:h-[450px]
      transition-all duration-500 ease-in-out
      "
      >
        {/* background Image */}
        <Image
          src={content.image}
          alt={content.title}
          priority
          width={1800}
          height={1200}
          className="w-full brightness-90 h-full object-cover"
        />

        <div
          className=" absolute top-0 left-0 bottom-0 right-0 text-white dark:text-white
        bg-gradient-to-t from-black/60 via-black/40 to-black/15 to-95% px-4 py-10 gap-6
        flex flex-col
        "
        >
          {/* title and btn */}
          <div
            className="flex items-center gap-4 flex-wrap transition-all duration-500 ease-in-out
      mx-auto max-w-7xl justify-start w-full
      "
          >
            <h2 className="text-xl font-bold">Les plus Populaires</h2>
            {/* <ArrowBigRight className="text-primary" /> */}
          </div>

          {/* content */}
          <Link
            href={"#"}
            className="mx-auto max-w-7xl w-full flex items-center justify-start gap-4 hover:opacity-70"
          >
            {/* image */}
            <Image
              src={content.image}
              alt={content.title}
              priority
              width={1000}
              height={800}
              className="w-40 h-56 object-cover rounded-lg shadow-md"
            />
            {/* info */}
            <div
              className="flex-1 flex-col flex gap-4 h-full flex-wrap capitalize overflow-hidden 
            transition-all duration-500 ease-in-out"
            >
              {/* title */}
              <h3
                className="md:text-md text-2xl font-bold line-clamp-4 md:line-clamp-2 max-w-md text-balance
              transition-all duration-500 ease-in-out
              "
              >
                {content.title}
              </h3>
              {/* type and language */}
              <p className="text-xs font-medium capitalize flex items-center gap-2">
                <span>
                  {returnDataValue({
                    data: CategoriesData,
                    value: content.category,
                  })}
                </span>
                <span className="text-blue-600">
                  {returnDataValue({
                    data: LanguagesData,
                    value: content.language,
                  })}
                </span>
              </p>

              {/* desc */}
              <p
                className="text-xs hidden md:block md:line-clamp-6 line-clamp-5 
              text-gray-200 max-w-md text-pretty w-full transition-all duration-500 ease-in-out"
              >
                {capitalizeFirstLetter(content.description)}
              </p>

              {/* categories */}

              <p
                className="text-xs font-medium capitalize hidden md:flex 
              items-center gap-2 shrink-0 max-w-md line-clamp-1 transition-all duration-500 ease-in-out"
              >
                {content.tags.map((tag, idx) => (
                  <span key={idx}>
                    {returnDataValue({ value: tag, data: TagsData })}
                  </span>
                ))}
              </p>

              {/*author and Edition  */}
              <p className="text-sm font-medium capitalize">
                <span>Jean Paul</span>, <span>Minesco edt</span>
              </p>
            </div>
          </Link>

          {/* dot btn nav */}
          <div className="w-full flex items-center justify-center gap-1.5 mt-auto">
            {ContentsData.map((_, idx) => (
              <span
                key={idx}
                role="button"
                tabIndex={0}
                aria-label="Passer au contenu suivant"
                className={cn(
                  "size-2 rounded-full transition-all duration-500 ease-in-out",
                  index === idx ? "bg-white" : "bg-white/40"
                )}
                onClick={() => setIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularTopContent;
