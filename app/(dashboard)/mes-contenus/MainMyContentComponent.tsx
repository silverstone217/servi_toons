"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryType } from "@/types/contentTypes";
import { CategoriesData, LanguagesData } from "@/utils/data";
import { returnDataValue } from "@/utils/functions";
import { Content } from "@prisma/client";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type Props = {
  contents: Content[];
};

const MainMyContentComponent = ({ contents }: Props) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<categoryType | "all">("all");

  const filteredContents = useMemo(
    () =>
      contents
        .filter(
          (con) =>
            con.title.includes(searchText.trim().toLocaleLowerCase()) ||
            (con.author &&
              con.author.includes(searchText.trim().toLocaleLowerCase())) ||
            (con.artist &&
              con.artist.includes(searchText.trim().toLocaleLowerCase())) ||
            (con.edition &&
              con.edition.includes(searchText.trim().toLocaleLowerCase()))
        )
        .filter((con) =>
          category === "all" ? true : con.category === category
        ),
    [contents, searchText, category]
  );

  return (
    <div className="w-full flex flex-col gap-6 transition-all duration-500 ease-in-out">
      {/* filter top */}
      <div className="w-full flex flex-col gap-2">
        {/* search */}
        <div className="relative w-full flex items-center">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-5
          "
          />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 pl-10 text-sm"
            placeholder="Chercher par titre ou nom de l'auteur..."
            type="search"
          />
        </div>
        {/* Category */}
        <div
          className="w-full flex flex-row p-2 pb-4  border-b-2 gap-2 
        transition-all duration-500 ease-in-out
         overflow-x-auto"
        >
          {/* all */}
          <Button
            variant={category === "all" ? "default" : "outline"}
            onClick={() => setCategory("all")}
          >
            <span>Tout</span>
          </Button>

          {/* others */}
          {CategoriesData.map((cat, idx) => (
            <Button
              variant={category === cat.value ? "default" : "outline"}
              key={idx}
              onClick={() => setCategory(cat.value as categoryType)}
            >
              <span>{cat.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* contents */}

      <div className="space-y-4 transition-all duration-500 ease-in-out">
        <h2 className="text-xl font-medium">
          Mes contenus ({filteredContents.length.toString().padStart(2, "0")})
        </h2>
        <div
          className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6
      2xl:grid-cols-8 gap-4 gap-y-6 transition-all duration-500 ease-in-out
      "
        >
          {filteredContents.map((content, idx) => (
            <Link href={`/mes-contenus/${content.id}`} key={idx}>
              <CardContent content={content} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMyContentComponent;

export const CardContent = ({ content }: { content: Content }) => {
  return (
    <div className="w-full  flex flex-col gap-4 group transition-all duration-500 ease-in-out">
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
          className="capitalize text-sm line-clamp-2 cursor-pointer
                    transition-all duration-500 ease-in-out font-medium"
        >
          {content.title}
        </h4>
        <div className="flex items-center gap-2 justify-between text-[10px] opacity-75">
          <span>
            {returnDataValue({ value: content.category, data: CategoriesData })}
          </span>
          <span className="text-primary">
            {returnDataValue({ value: content.language, data: LanguagesData })}
          </span>
        </div>
      </div>
    </div>
  );
};
