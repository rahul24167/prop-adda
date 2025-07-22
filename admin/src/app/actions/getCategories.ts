'use server'; 
import { prisma } from '@/src/lib/prisma';
import { Category } from '@prisma/client';

export const getCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany();
  return categories;
};
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
};