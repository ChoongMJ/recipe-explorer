"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import API from "../services/api";
import { useParams } from "next/navigation";

export default function RecipeDetail() {

  const {id} = useParams();
  
  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => API.getRecipeById(id as string),
    enabled: !!id,
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
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline hover:text-blue-700">
          Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="mb-6 inline-block text-blue-600 hover:text-blue-700 hover:underline">
        &larr; Back to recipes
      </Link>
      
      <div className="overflow-hidden rounded-lg border border-border bg-surface text-surface-foreground shadow-md">
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
              <span className="rounded-full bg-tag px-3 py-1 text-sm text-tag-foreground">
                {recipe?.strCategory ?? ""}
              </span>
              <span className="rounded-full bg-tag-alt px-3 py-1 text-sm text-tag-alt-foreground">
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
        
        <div className="border-t border-border p-6">
          <h2 className="text-xl font-bold mb-3">Instructions</h2>
          <p className="whitespace-pre-line">{recipe?.strInstructions ?? ""}</p>
          
          {recipe?.strYoutube && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-3">Video Tutorial</h2>
              <a 
                href={recipe?.strYoutube ?? ""} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
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
