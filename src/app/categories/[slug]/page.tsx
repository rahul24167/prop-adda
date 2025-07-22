"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProducts } from "../../actions/getProduct";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
const SlugPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts(slug as string);
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, [slug]);
  // const products = [
  //   {
  //     id: "123",
  //     imageUrl:
  //       "https://storage.googleapis.com/plency-store/images/650fe90e-eda5-4938-bda9-c56343b1367f",
  //     categoryId: "cat1",
  //     subCategoryId: "subcat1",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: "124",
  //     imageUrl:
  //       "https://storage.googleapis.com/plency-store/images/650fe90e-eda5-4938-bda9-c56343b1367f",
  //     categoryId: "cat1",
  //     subCategoryId: "subcat2",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: "125",
  //     imageUrl:
  //       "https://storage.googleapis.com/plency-store/images/650fe90e-eda5-4938-bda9-c56343b1367f",
  //     categoryId: "cat2",
  //     subCategoryId: "subcat1",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: "126",
  //     imageUrl:
  //       "https://storage.googleapis.com/plency-store/images/650fe90e-eda5-4938-bda9-c56343b1367f",
  //     categoryId: "cat2",
  //     subCategoryId: "subcat2",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // ];
  if (!slug) {
    return <div>Category not found</div>;
  }
  if (!products) {
    return <div>No products found for this category</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <Link
          href={`/products/${product.id}`}
          key={product.id}
          className="relative group rounded-xl overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105"
        >
          {/* Image */}
          <div className="relative w-full aspect-square">
            <Image
              src={product.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[1px]"
            />
          </div>

          {/* Gradient overlay shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Glow border effect */}
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition duration-700 pointer-events-none" />
        </Link>
      ))}
    </div>
  );
};

export default SlugPage;
