"use client";

import { useTransition } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={(formData) => {
          startTransition(() => {
            login(formData);
          });
        }}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between space-x-4">
          <button
            type="submit"
            disabled={isPending}
            className={`${
              isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
          >
            {isPending ? "Processing..." : "Log in"}
          </button>
        </div>
      </form>
    </div>
  );
}