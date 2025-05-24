"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Content } from "@prisma/client";
import { CategoriesData, LanguagesData } from "@/utils/data";
import { returnDataValue } from "@/utils/functions";
import { categoryType } from "@/types/contentTypes";

type Props = {
  contents: Content[];
};

const MainMyContentComponent = ({ contents }: Props) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<categoryType | "all">("all");

  const filteredContents = useMemo(() => {
    const lowerSearch = searchText.trim().toLowerCase();
    return contents
      .filter((con) => {
        const fields = [con.title, con.author, con.artist, con.edition].filter(
          Boolean
        );
        return (
          lowerSearch === "" ||
          fields.some((field) => field!.toLowerCase().includes(lowerSearch))
        );
      })
      .filter((con) => (category === "all" ? true : con.category === category));
  }, [contents, searchText, category]);

  return (
    <div className="w-full flex flex-col gap-8 transition-all duration-500 ease-in-out">
      {/* Filter section */}
      <div className="flex flex-col gap-4">
        {/* Search input */}
        <div className="relative max-w-md w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="search"
            placeholder="Chercher par titre ou nom de l'auteur..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
            aria-label="Recherche contenus"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <Button
            variant={category === "all" ? "default" : "outline"}
            onClick={() => setCategory("all")}
            size="sm"
          >
            Tout
          </Button>
          {CategoriesData.map((cat) => (
            <Button
              key={cat.value}
              variant={category === cat.value ? "default" : "outline"}
              onClick={() => setCategory(cat.value as categoryType)}
              size="sm"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Mes contenus ({filteredContents.length.toString().padStart(2, "0")})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
          {filteredContents.map((content) => (
            <Link
              href={`/mes-contenus/${content.id}`}
              key={content.id}
              className="group"
              aria-label={`Voir le contenu ${content.title}`}
            >
              <CardContent content={content} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainMyContentComponent;

export const CardContent = ({ content }: { content: Content }) => {
  return (
    <article
      className="flex flex-col gap-3 rounded-lg overflow-hidden bg-white 
    dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
    >
      <div className="relative w-full h-52 overflow-hidden rounded-t-lg">
        <Image
          src={content.image}
          alt={content.title}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          priority
        />
      </div>

      <div className="px-3 pb-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 capitalize mb-1">
          {content.title}
        </h3>
        <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
          <span>
            {returnDataValue({ value: content.category, data: CategoriesData })}
          </span>
          <span className="text-primary">
            {returnDataValue({ value: content.language, data: LanguagesData })}
          </span>
        </div>
      </div>
    </article>
  );
};
