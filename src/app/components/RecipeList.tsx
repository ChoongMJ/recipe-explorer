"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import API from "../services/api";

export default function RecipeList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const {
    data: recipesData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["recipes", debouncedSearchTerm],
    queryFn: () => API.getRecipes(debouncedSearchTerm),
    placeholderData: (previousData) => previousData,
  });

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["recipe-categories"],
    queryFn: API.getCategories,
  });

  const meals = recipesData?.meals ?? [];
  const categories = categoriesData?.categories ?? [];
  const filteredMeals = selectedCategory
    ? meals.filter((recipe) => recipe.strCategory === selectedCategory)
    : meals;

  if (isLoading && !recipesData) {
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
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)_minmax(0,260px)] lg:items-end">
        <div>
          <h2 className="text-2xl font-bold">All Recipes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by recipe name and refine the results by category.
          </p>
        </div>

        <div className="w-full">
          <label htmlFor="recipe-search" className="mb-2 block text-sm font-medium text-muted-foreground">
            Search recipes
          </label>
          <input
            id="recipe-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Try chicken, pasta, curry..."
            className="w-full rounded-lg border border-input-border bg-input px-4 py-3 text-input-foreground shadow-sm outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="w-full">
          <label htmlFor="recipe-category" className="mb-2 block text-sm font-medium text-muted-foreground">
            Filter by category
          </label>
          <select
            id="recipe-category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-lg border border-input-border bg-input px-4 py-3 text-input-foreground shadow-sm outline-none transition focus:border-input-focus focus:ring-2 focus:ring-ring"
            disabled={isCategoriesLoading || isCategoriesError}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.idCategory} value={category.strCategory}>
                {category.strCategory}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-6 min-h-5 text-sm text-muted-foreground">
        {isFetching
          ? "Searching recipes..."
          : `${filteredMeals.length} recipe${filteredMeals.length === 1 ? "" : "s"} found${selectedCategory ? ` in ${selectedCategory}` : ""}`}
      </p>

      {isCategoriesError && (
        <div className="mb-6 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
          <p>Categories could not be loaded, but recipe search is still available.</p>
        </div>
      )}

      {filteredMeals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-muted-foreground">
          <p className="text-lg font-semibold text-surface-foreground">No recipes found</p>
          <p className="mt-2">
            Try a different keyword, switch category, or clear the filters to see more recipes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMeals.map((recipe) => (
          <Link href={`/recipe/${recipe.idMeal}`} key={recipe.idMeal}>
            <div className="overflow-hidden rounded-lg border border-border bg-surface text-surface-foreground shadow-md transition-shadow duration-300 hover:shadow-lg">
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
                <h3 className="truncate text-lg font-bold">{recipe.strMeal}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Click to view details</p>
              </div>
            </div>
          </Link>
          ))}
        </div>
      )}
    </div>
  );
} 
