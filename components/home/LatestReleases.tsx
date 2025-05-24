"use client";

import React from "react";
import Image from "next/image";
import { ContentsData } from "@/utils/contentData";
import { CategoriesData, LanguagesData } from "@/utils/data";
import { returnDataValue } from "@/utils/functions";

const LatestReleases = () => {
  return (
    <section className="w-full bg-white dark:bg-gray-900 py-16 px-4 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Dernièrement ajoutés
        </h2>
        {/* Vous pouvez décommenter et ajouter une icône ici si besoin */}
        {/* <ArrowBigRight className="text-primary w-6 h-6" /> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-1  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 max-w-7xl mx-auto">
        {ContentsData.map((content, idx) => (
          <article
            key={idx}
            className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl 
            shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
              <Image
                src={content.image}
                alt={content.title}
                fill
                className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                priority
              />
            </div>

            {/* Content info */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {content.title}
              </h3>

              <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-600 dark:text-gray-300 mb-3 capitalize">
                <span>
                  {returnDataValue({
                    data: CategoriesData,
                    value: content.category,
                  })}
                </span>
                <span className="text-primary">
                  {returnDataValue({
                    data: LanguagesData,
                    value: content.language,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400 mt-auto">
                <span className="font-medium">
                  chap. {(5 + idx).toString().padStart(2, "0")}
                </span>
                <span>•</span>
                <time dateTime="2025-05-19" className="whitespace-nowrap">
                  19.05.2025
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LatestReleases;
