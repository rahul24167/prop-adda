"use server";
import { prisma } from '@/src/lib/prisma';
import { SubCategory } from "@prisma/client";

export const createSubCategory = async (subCategory: SubCategory) => {
  try {
    const newSubCategory = await prisma.subCategory.create({
      data: subCategory,
    });
    if (!newSubCategory) {
      return { status: 500, message: "Failed to create subcategory" };
    }
    return {
      status: 200,
      message: "Subcategory created successfully",
      subCategory: newSubCategory,
    };
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
};
