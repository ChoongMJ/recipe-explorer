"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

import API from "../services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import FavoriteButton from "./FavoriteButton";

const ALL_CATEGORIES_VALUE = "all";

function RecipeListSkeleton() {
  return (
    <div>
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)_minmax(0,220px)_auto] lg:items-end">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <Skeleton className="h-9 w-full rounded-lg lg:w-28" />
      </div>

      <Skeleton className="mb-6 h-4 w-44" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden py-0">
            <Skeleton className="h-48 w-full rounded-none" />
            <CardHeader className="gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
    queryKey: ["recipes", debouncedSearchTerm, selectedCategory],
    queryFn: () =>
      selectedCategory
        ? API.getRecipesByCategory(selectedCategory)
        : API.getRecipes(debouncedSearchTerm),
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
  const filteredMeals = selectedCategory && debouncedSearchTerm
    ? meals.filter((recipe) =>
        recipe.strMeal.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : meals;

  if (isLoading && !recipesData) {
    return <RecipeListSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Unable to load recipes</AlertTitle>
        <AlertDescription>
          Please try again in a moment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)_minmax(0,220px)_auto] lg:items-end">
        <div>
          <h2 className="text-2xl font-bold">All Recipes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by recipe name and refine the results by category.
          </p>
        </div>

        <div className="w-full">
          <Label htmlFor="recipe-search" className="mb-2 block">
            Search recipes
          </Label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="recipe-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try chicken, pasta, curry..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-full">
          <Label htmlFor="recipe-category" className="mb-2 block">
            Filter by category
          </Label>
          {isCategoriesLoading ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : (
            <Select
              value={selectedCategory || ALL_CATEGORIES_VALUE}
              onValueChange={(value) =>
                setSelectedCategory(value === ALL_CATEGORIES_VALUE ? "" : value ?? "")
              }
              disabled={isCategoriesError}
            >
              <SelectTrigger id="recipe-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES_VALUE}>All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.idCategory} value={category.strCategory}>
                    {category.strCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("");
          }}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full lg:w-auto"
          )}
        >
          Clear filters
        </button>
      </div>

      <p className="mb-6 min-h-5 text-sm text-muted-foreground">
        {isFetching
          ? "Searching recipes..."
          : `${filteredMeals.length} recipe${filteredMeals.length === 1 ? "" : "s"} found${selectedCategory ? ` in ${selectedCategory}` : ""}`}
      </p>

      {isCategoriesError && (
        <Alert className="mb-6">
          <AlertTitle>Categories unavailable</AlertTitle>
          <AlertDescription>
            Category filtering is temporarily unavailable, but recipe search still works.
          </AlertDescription>
        </Alert>
      )}

      {filteredMeals.length === 0 ? (
        <Card className="border-dashed py-10 text-center">
          <CardHeader>
            <CardTitle>No recipes found</CardTitle>
            <CardDescription>
              Try a different keyword, switch category, or clear the filters to see more recipes.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMeals.map((recipe) => (
            <Card
              key={recipe.idMeal}
              className="overflow-hidden py-0 transition-shadow duration-300 hover:shadow-lg"
            >
                <div className="relative h-48 w-full">
                  <Link
                    href={`/recipe/${recipe.idMeal}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View ${recipe.strMeal}`}
                  />
                  <Image
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <FavoriteButton
                    recipe={recipe}
                    className="absolute right-3 top-3 z-20"
                  />
                </div>
                <CardHeader className="gap-1">
                  <CardTitle className="truncate">
                    <Link href={`/recipe/${recipe.idMeal}`} className="hover:underline">
                      {recipe.strMeal}
                    </Link>
                  </CardTitle>
                  <CardDescription>Click to view details</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link
                    href={`/recipe/${recipe.idMeal}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Explore ingredients, instructions, and related recipe details.
                  </Link>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
