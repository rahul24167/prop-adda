export const dynamic = "force-dynamic";
import { getCategories } from "../app/actions/getCategories";
import CategoryCard from "./components/categoryCard";

export default async function Home() {
  const categories = await getCategories();
  return (
    
    <div className="p-6">
      
      <div className="flex flex-wrap -mx-3">
        {categories.map((category) => (
          
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
