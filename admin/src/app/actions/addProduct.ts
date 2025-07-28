"use server";
import { prisma } from "@/src/lib/prisma";
import { Product } from "@prisma/client";

export async function addProduct(productData: Product) {
  const product = await prisma.product.create({
    data: productData,
  });
  return product;
}
export async function addProducts(products: Product[]) {
  const addedProducts = [];
  try {
    if (!products || products.length === 0) {
      return { status: 400, error: "No products to add" };
    }
    for (const product of products) {
      const addedProduct = await prisma.product.create({
        data: {
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          subCategoryId: product.subCategoryId,
        }
      });
      addedProducts.push(addedProduct);
    }
    return {addedProducts, status: 200, message: "Products added successfully"};
  } catch (error) {
    console.error("Error adding products:", error);
    return { status: 500, error };
  }
}
