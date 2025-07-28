"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { uploadToGCS } from "../utils/GCPUploader";
import { createCategory } from "../actions/createCategory";
import { getCategories } from "../actions/getCategories";
import { Category } from "@prisma/client";

const CategoriesPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    // Fetch existing categories from the database

    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
   <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
  <h1 className="text-2xl font-bold mb-4">Categories</h1>

  <button
    onClick={() => setIsCreating(true)}
    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
  >
    Create Category
  </button>

  {isCreating && (
    <div className="mb-6 space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append("name", categoryName);
          formData.append("cover", coverUrl);
          createCategory(formData).then((res) => {
            if (res.status === 200) {
              alert(res.message);
              setIsCreating(false);
              setCategoryName("");
              setCoverUrl("");
            } else {
              alert("Error: " + res.message);
            }
          });
        }}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="space-y-1">
          <label htmlFor="cover" className="block font-medium text-gray-700">
            Cover Image
          </label>
          <input
            type="file"
            name="cover"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadToGCS(file).then((url) => setCoverUrl(url));
              }
            }}
            className="w-full border border-gray-300 rounded px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>

      {coverUrl && (
        <Image
          src={coverUrl}
          width={500}
          height={500}
          alt="Cover Image"
          className="rounded-lg shadow"
          unoptimized
        />
      )}
    </div>
  )}

  <ul className="space-y-2">
    {categories.map((category) => (
      <li
        key={category.id}
        className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-50"
      >
        {category.name}
      </li>
    ))}
  </ul>
</div>
    
  );
};

export default CategoriesPage;
