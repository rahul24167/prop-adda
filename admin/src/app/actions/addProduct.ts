"use server";
import { prisma } from "@/src/lib/prisma";
import { Product } from "@prisma/client";

export async function addProduct(productData: Product) {
  const product = await prisma.product.create({
    data: productData,
  });
  return product;
}