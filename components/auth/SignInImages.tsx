"use client";
import React, { useEffect, useState } from "react";
import img1 from "@/public/images/manga2.png";
import img2 from "@/public/images/manga3.jpg";
import img3 from "@/public/images/manga5.jpg";
import Image from "next/image";

const IMAGES = [img1, img2, img3];

const SignInImages = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === IMAGES.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full md:h-full relative rounded-xl">
      <Image
        src={IMAGES[index]}
        alt="Manga"
        className="object-cover h-52 md:h-full w-full shadow-lg rounded-xl "
        onClick={handleNext}
        width={1200}
        height={1200}
        priority
      />
    </div>
  );
};

export default SignInImages;
