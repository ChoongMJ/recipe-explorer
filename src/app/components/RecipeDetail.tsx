"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import API from "../services/api";

export default function RecipeDetail({ id }: { id: string }) {
  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => API.getRecipeById(id),
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
        <p>Error loading recipe. Please try again later.</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="text-primary hover:underline mb-6 inline-block">
        &larr; Back to recipes
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden text-black">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full w-full">
              <Image
                src={recipe?.strMealThumb ?? ""}
                alt={recipe?.strMeal ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold">{recipe?.strMeal ?? ""}</h1>
            
            <div className="flex gap-2 mt-3">
              <span className="bg-secondary pr-2 py-1 rounded-full text-sm">
                {recipe?.strCategory ?? ""}
              </span>
              <span className="bg-accent text-gray-800 px-2 py-1 rounded-full text-sm">
                {recipe?.strArea ?? ""}
              </span>
            </div>
            
            <h2 className="text-xl font-bold mt-6 mb-2">Ingredients</h2>
            <ul className="list-disc pl-5 space-y-1">
              {recipe?.ingredients.map((item, index) => (
                <li key={index}>
                  {item.measure} {item.ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold mb-3">Instructions</h2>
          <p className="whitespace-pre-line">{recipe?.strInstructions ?? ""}</p>
          
          {recipe?.strYoutube && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3">Video Tutorial</h2>
              <a 
                href={recipe?.strYoutube ?? ""} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 