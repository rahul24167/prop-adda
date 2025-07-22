"use server";
import { prisma } from "@/src/lib/prisma"
import { Category } from "@prisma/client";

export const getCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany();
    if (!categories) {
        console.error("No categories found");
        return [];
    }
  return categories;
};
