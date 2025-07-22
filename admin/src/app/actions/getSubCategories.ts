"use server"
import { prisma } from '@/src/lib/prisma';

export const getSubCategories = async (categoryId: string) => {
    const subCategories = await prisma.subCategory.findMany({
        where: { categoryId },
    });
    return subCategories;
};
