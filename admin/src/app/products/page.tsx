"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Category, SubCategory, Product } from "@prisma/client";
import { getCategories } from "../actions/getCategories";
import { getSubCategories } from "../actions/getSubCategories";
import { createSubCategory } from "../actions/createSubCategory";
import { addProducts } from "../actions/addProduct";
import { uploadToGCS } from "../utils/GCPUploader";

const ProductsPage = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [isNewSubCategory, setIsNewSubCategory] = useState<boolean>(false);
  const [newSubCategory, setNewSubCategory] = useState<SubCategory | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [productUrlIndex, setProductUrlIndex] = useState<number>(0);
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
  }, []);
  useEffect(() => {
    if (category) {
      getSubCategories(category.id)
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
    }
  }, [category]);
  useEffect(() => {
    setProducts([]); // Reset products when category changes
    setSubCategory(null); // Reset subcategory when category changes
    setIsNewSubCategory(false); // Reset new subcategory state
  }, [category]);
  useEffect(() => {
    if (subCategory) {
      setIsNewSubCategory(false);
    }
    setProducts([]); // Reset products when subCategory changes
  }, [subCategory]);
  const handleSubmit = async () => {
    if (products.length === 0) {
      console.error("Product data is incomplete");
      return;
    }
    addProducts(products).then((res) => {
      if (res.error) {
        alert("Failed to add product");
        return;
      } else {
        alert("Products added successfully");
        setProducts([]); // Clear products after successful submission
        setCategory(null); // Reset category selection
        setSubCategory(null); // Reset subcategory selection
        setIsNewSubCategory(false); // Reset new subcategory state
      }
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
        {category && (isNewSubCategory || subCategories.length > 0) && (
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
        )}

        {/* New Subcategory Input */}
        {subCategory === null && isNewSubCategory && category?.id && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter new subcategory"
              onChange={(e) => {
                setNewSubCategory({
                  id: "",
                  name: e.target.value,
                  categoryId: category!.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }}
              className="w-full px-4 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                if (!newSubCategory) return;
                createSubCategory(newSubCategory)
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
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                Array.from(files).forEach((file) => {
                  uploadToGCS(file).then((url) =>
                    setProducts((prev) => [
                      ...prev,
                      {
                        id: "",
                        imageUrl: url,
                        categoryId: category!.id,
                        subCategoryId: subCategory!.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    ])
                  );
                });
              }
              setProductUrlIndex(0);
            }}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={products.length === 0}
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition disabled:cursor-not-allowed"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Add Product
        </button>
      </form>

      {/* Image Preview */}
      {products.length > 0 && (
        <div className="w-full max-w-sm mx-auto text-center">
          <p className="text-sm text-gray-600 mb-3">Uploaded Image Preview</p>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                setProductUrlIndex((prev) =>
                  prev > 0 ? prev - 1 : products.length - 1
                );
              }}
              className="px-3 py-1 text-lg font-bold text-gray-700 hover:text-gray-900"
            >
              &lt;
            </button>

            <span className="text-sm text-gray-500">
              {productUrlIndex + 1} of {products.length}
            </span>

            <button
              onClick={() => {
                setProductUrlIndex((prev) =>
                  prev < products.length - 1 ? prev + 1 : 0
                );
              }}
              className="px-3 py-1 text-lg font-bold text-gray-700 hover:text-gray-900"
            >
              &gt;
            </button>
          </div>

          <div className="aspect-square relative border rounded-lg shadow-md overflow-hidden">
            <Image
              src={products[productUrlIndex].imageUrl}
              alt="Product Image"
              fill
              className="object-contain"
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
