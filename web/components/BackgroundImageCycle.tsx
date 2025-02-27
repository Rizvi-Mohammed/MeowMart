"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  images?: string[];
  interval?: number;
  opacity?: number;
};

const defaultImages = [
  "https://images.pexels.com/photos/19607032/pexels-photo-19607032/free-photo-of-a-cat-laying-on-the-steps-outside-a-house.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/29812792/pexels-photo-29812792/free-photo-of-elegant-calico-cat-perched-on-garden-post.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/29787847/pexels-photo-29787847/free-photo-of-expressive-tabby-cat-licking-lips-close-up.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/160755/kittens-cats-foster-playing-160755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const BackgroundImageCycle: React.FC<Props> = ({
  images = defaultImages,
  interval = 5000,
  opacity = 0.4,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);

  useEffect(() => {
    const cycleImages = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setNextImageIndex((prev) => (prev + 1) % images.length);
    };

    const timer = setInterval(cycleImages, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background images with crossfade effect */}
      <div className="absolute inset-0">
        {/* Current image */}
        <Image
          key={`image-${currentImageIndex}`}
          src={images[currentImageIndex]}
          alt="Background"
          fill
          priority
          className={`
            absolute inset-0 object-cover transition-opacity duration-1000 
            animate-fade-in opacity-${Math.round(opacity * 100)}
          `}
        />

        {/* Next image */}
        <Image
          key={`image-${nextImageIndex}`}
          src={images[nextImageIndex]}
          alt="Background"
          fill
          priority
          className={`
            absolute inset-0 object-cover transition-opacity duration-1000 
            animate-fade-out opacity-0
          `}
        />
      </div>
    </div>
  );
};

export default BackgroundImageCycle;
