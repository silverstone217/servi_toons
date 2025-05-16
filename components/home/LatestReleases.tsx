"use client";
import { ContentsData } from "@/utils/contentData";
import { CategoriesData, LanguagesData } from "@/utils/data";
import { returnDataValue } from "@/utils/functions";
import Image from "next/image";
import React from "react";

const LatestReleases = () => {
  return (
    <div
      className="w-full flex flex-col gap-6 py-14 transition-all 
    duration-500 ease-in-out px-4 shadow dark:bg-black bg-white"
    >
      <div
        className="flex items-center gap-4 flex-wrap transition-all duration-500 ease-in-out
       mx-auto max-w-7xl w-full
      "
      >
        <h2 className="text-2xl font-bold">Dernierement ajoutés</h2>
        {/* <ArrowBigRight className="text-primary" /> */}
      </div>

      {/* contents */}
      <div
        className="transition-all duration-500 ease-in-out flex flex-col gap-4 md:gap-y-8 md:grid 
      md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4  mx-auto max-w-7xl "
      >
        {ContentsData.map((content, idx) => (
          <div key={idx} className="w-full">
            <div
              className="flex w-full items-start gap-4 justify-start pb-4 md:pb-0
             md:border-b-0 border-b-[0.1px] border-secondary transition-all duration-500 ease-in-out"
            >
              {/* image */}
              <div className="w-24 h-32 overflow-hidden rounded-lg">
                <Image
                  src={content.image}
                  priority
                  alt={content.title}
                  width={800}
                  height={850}
                  className="w-full h-full object-cover rounded-lg hover:scale-125 cursor-pointer
                  transition-all duration-500 ease-in-out
                  "
                />
              </div>
              {/* title and chap */}
              <div className="flex-1 gap-2 flex flex-col">
                <h4
                  className="text-sm font-medium capitalize cursor-pointer hover:opacity-70  
                transition-all duration-500 ease-in-out line-clamp-2"
                >
                  {content.title}
                </h4>
                <p className="text-xs opacity-70 capitalize flex items-center gap-2">
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
                </p>
                <p
                  className="text-sm flex items-center gap-2 flex-wrap cursor-pointer hover:opacity-70
                 transition-all duration-500 ease-in-out
                "
                >
                  <span>chap. {(5 + idx).toString().padStart(2, "0")}</span>
                  <span>-</span>
                  <span>19.05.2025</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestReleases;
