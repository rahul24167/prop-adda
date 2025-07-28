import React from "react";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
  href={`/categories/${category.id}`}
  key={category.id}
  className="w-full sm:w-1/2 px-3 mb-6"
>
  <div className="group relative w-full aspect-video overflow-hidden rounded-xl shadow hover:shadow-xl transition-shadow duration-400">
    {/* Image */}
    <div className="relative w-full h-full">
      <Image
        src={category.imageUrl}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        unoptimized
      />

      {/* Overlay with category name */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
      </div>
    </div>
  </div>
</Link>

  );
};

export default CategoryCard;
