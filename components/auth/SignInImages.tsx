"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import img1 from "@/public/images/manga2.png";
import img2 from "@/public/images/manga3.jpg";
import img3 from "@/public/images/manga5.jpg";

const IMAGES = [img1, img2, img3];

const SignInImages = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full  overflow-hidden shadow-xl">
      <Image
        src={IMAGES[index]}
        alt={`Image manga ${index + 1}`}
        fill
        className="object-cover"
        onClick={() => setIndex(index === IMAGES.length - 1 ? 0 : index + 1)}
        priority
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            className={`w-4 h-4 rounded-full transition-colors focus:outline-none ${
              i === index ? "bg-primary" : "bg-gray-400 dark:bg-gray-600"
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Afficher l'image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SignInImages;
