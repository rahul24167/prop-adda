import Image from "next/image";
import { getCategories } from "../app/actions/getCategories";
import CategoryCard from "./components/categoryCard";

export default async function Home() {
  const categories = await getCategories();
 

  return (
    
    <div className="p-6">
      <div className="w-full mb-6 text-2xl font-bold">LOGO</div>

      <div className="flex flex-wrap -mx-3">
        {categories.map((category) => (
          
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
