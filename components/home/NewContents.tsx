"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Content } from "@prisma/client";
import { ArrowBigRight } from "lucide-react";

type Props = {
  contents: Content[];
};

const NewContents = ({ contents }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollDirection = useRef<"right" | "left">("right");

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollStep = 170; // pixels à scroller à chaque intervalle
    const delay = 3000; // 5 secondes

    const interval = setInterval(() => {
      if (!scrollContainer) return;

      if (scrollDirection.current === "right") {
        // Scroll vers la droite
        const maxScrollLeft =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (scrollContainer.scrollLeft + scrollStep >= maxScrollLeft) {
          // Atteint la fin, changer de direction
          scrollDirection.current = "left";
          scrollContainer.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
        }
      } else {
        // Scroll vers la gauche
        if (scrollContainer.scrollLeft - scrollStep <= 0) {
          // Atteint le début, changer de direction
          scrollDirection.current = "right";
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
        }
      }
    }, delay);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="w-full bg-gray-50 dark:bg-gray-900 border-y border-gray-300 
    dark:border-gray-700 pt-12 px-4 transition-colors duration-500 ease-in-out shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Nouveaux Contenus
        </h2>
        <ArrowBigRight className="w-6 h-6 text-primary" />
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto overflow-x-auto scrollbar-thin scrollbar-thumb-rounded 
        scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 pb-12"
      >
        <div className="flex gap-6 min-h-[260px]">
          {contents.concat(contents.slice(0, 3)).map((content, idx) => (
            <div key={idx} className="flex-shrink-0 w-40 md:w-44 lg:w-48">
              <CardContent content={content} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewContents;

// type CardProps = {
//   title: string;
//   slug: string;
//   image: StaticImageData;
//   description: string;
//   category: string;
//   tags: string[];
//   target: string;
//   authorId: string;
//   language: string;
// };

export const CardContent = ({ content }: { content: Content }) => {
  return (
    <article
      className="flex flex-col gap-3 cursor-pointer rounded-lg overflow-hidden shadow-sm 
    bg-white dark:bg-gray-800 transition-shadow duration-300 hover:shadow-lg h-full"
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
      {/* Fixer la hauteur du titre pour 2 lignes max */}
      <h4
        className="px-3 pb-3 text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 capitalize"
        style={{ minHeight: "3rem" }} // ~2 lignes de texte (ajustez selon votre taille de font)
      >
        {content.title}
      </h4>
    </article>
  );
};
