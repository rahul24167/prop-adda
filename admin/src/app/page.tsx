"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase/client";
export default function Home() {
   const router = useRouter();
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-md">
  <div className="flex space-x-6">
    <Link href="/categories" className="text-blue-600 hover:text-blue-800 font-medium">
      Categories
    </Link>
    <Link href="/products" className="text-blue-600 hover:text-blue-800 font-medium">
      Products
    </Link>
  </div>

  <button
    onClick={handleLogout}
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
  >
    Logout
  </button>
</div>

  );
}
