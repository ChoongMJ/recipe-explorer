"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import API from "../services/api";

export default function RecipeList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recipes"],
    queryFn: API.getRecipes,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error loading recipes. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.meals.map((recipe) => (
          <Link href={`/recipe/${recipe.idMeal}`} key={recipe.idMeal}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate text-black">{recipe.strMeal}</h3>
                <p className="text-sm text-gray-600 mt-1">Click to view details</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 