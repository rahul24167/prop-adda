"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Category, SubCategory, Product } from "@prisma/client";
import { getCategories } from "../actions/getCategories";
import { getSubCategories } from "../actions/getSubCategories";
import { createSubCategory } from "../actions/createSubCategory";
import { addProduct } from "../actions/addProduct";
import { uploadToGCS } from "../utils/GCPUploader";

const ProductsPage = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [isNewSubCategory, setIsNewSubCategory] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>({
    id: "",
    categoryId: "",
    subCategoryId: "",
    imageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [productImageUrl, setProductImageUrl] = useState<string>("");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (!data) {
          console.error("No categories found");
          return;
        }
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [categories]);
  const handleSubmit = async () => {
    if (!category || !subCategory || !productImageUrl) {
      console.error(
        "Category, Subcategory, and Product Image must be selected"
      );
      return;
    }
    if (!product) {
      console.error("Product data is incomplete");
      return;
    }
    addProduct(product).then((res) => {
      if (!res) {
        alert("Failed to add product");
        return;
      }
      alert("Product added successfully:" + res.id);
      setProduct({
        ...product,
        id: res.id,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      });
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <form action="" className="space-y-4">
        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category?.name}
            onChange={(e) => {
              setCategory(
                categories.find((cat) => cat.name === e.target.value) || null
              );
              getSubCategories(e.target.value)
                .then((data) => {
                  if (!data) {
                    console.error("No subcategories found for this category");
                    return;
                  }
                  setSubCategories(data);
                })
                .catch((error) => {
                  console.error("Error fetching subcategories:", error);
                });
            }}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory
          </label>
          <select
            value={subCategory?.name}
            onChange={(e) => {
              if (e.target.value === "") {
                setSubCategory(null);
                setIsNewSubCategory(true);
                return;
              }
              setSubCategory(
                subCategories.find(
                  (subCat) => subCat.name === e.target.value
                ) || null
              );
            }}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subCat) => (
              <option key={subCat.id} value={subCat.name}>
                {subCat.name}
              </option>
            ))}
            <option value="">Others</option>
          </select>
        </div>

        {/* New Subcategory Input */}
        {subCategory === null && isNewSubCategory && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter new subcategory"
              onChange={(e) => {
                setSubCategory({
                  id: "",
                  name: e.target.value,
                  categoryId: category?.id || "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }}
              className="w-full px-4 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                if (!subCategory) return;
                createSubCategory(subCategory)
                  .then((res) => {
                    if (res.status !== 200) {
                      console.error(
                        "Failed to create subcategory:",
                        res.message
                      );
                      return;
                    }
                    if (res.subCategory) {
                      setSubCategories([...subCategories, res.subCategory]);
                      setSubCategory(res.subCategory);
                      setIsNewSubCategory(false);
                      console.log(
                        "Subcategory created successfully:",
                        res.subCategory
                      );
                    } else {
                      console.error(
                        "Subcategory creation response missing subCategory"
                      );
                    }
                  })
                  .catch((error) => {
                    console.error("Error creating subcategory:", error);
                  });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create New SubCategory
            </button>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (!file) return;
                uploadToGCS(file).then((url) => {
                  if (!url) {
                    console.error("Failed to upload image");
                    return;
                  }
                  setProduct({
                    id: product?.id ?? "",
                    imageUrl: url,
                    categoryId: category?.id || "",
                    subCategoryId: subCategory?.id || "",
                    createdAt: product?.createdAt ?? new Date(),
                    updatedAt: new Date(),
                  });
                });
              }
            }}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={handleSubmit}
        >
          Add Product
        </button>
      </form>

      {/* Image Preview */}
      {productImageUrl && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Uploaded Image Preview</p>
          <div className="inline-block max-w-xs max-h-60">
            <Image
              src={productImageUrl}
              alt="Product Image"
              fill
              className="relative h-auto w-auto max-h-60 max-w-full rounded-md border object-contain"
              sizes="(max-width: 256px) 100vw, 256px"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
