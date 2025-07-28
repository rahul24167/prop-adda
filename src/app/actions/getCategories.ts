"use server";
import { prisma } from "@/src/lib/prisma";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
