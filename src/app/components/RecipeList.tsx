"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircleIcon, SearchIcon } from "lucide-react";

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
import { cn } from "@/lib/utils";

const ALL_CATEGORIES_VALUE = "all";

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
    return (
      <div className="flex items-center justify-center py-16">
        <LoaderCircleIcon className="size-8 animate-spin text-primary" />
      </div>
    );
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
          <Select
            value={selectedCategory || ALL_CATEGORIES_VALUE}
            onValueChange={(value) =>
              setSelectedCategory(value === ALL_CATEGORIES_VALUE ? "" : value ?? "")
            }
            disabled={isCategoriesLoading || isCategoriesError}
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
            <Link href={`/recipe/${recipe.idMeal}`} key={recipe.idMeal}>
              <Card className="overflow-hidden py-0 transition-shadow duration-300 hover:shadow-lg">
                <div className="relative h-48 w-full">
                  <Image
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader className="gap-1">
                  <CardTitle className="truncate">{recipe.strMeal}</CardTitle>
                  <CardDescription>Click to view details</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    Explore ingredients, instructions, and related recipe details.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
