"use client";

import { useSyncExternalStore } from "react";

import type { RecipeSummary } from "@/app/services/api";

const FAVORITE_RECIPES_STORAGE_KEY = "favorite-recipes";
const FAVORITE_RECIPES_UPDATED_EVENT = "favorite-recipes-updated";
const EMPTY_FAVORITE_RECIPES: FavoriteRecipe[] = [];

let cachedFavoriteRecipes = EMPTY_FAVORITE_RECIPES;
let cachedFavoriteRecipesRawValue: string | null = null;

export type FavoriteRecipe = RecipeSummary;

function isFavoriteRecipe(value: unknown): value is FavoriteRecipe {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.idMeal === "string" &&
    typeof candidate.strMeal === "string" &&
    typeof candidate.strMealThumb === "string"
  );
}

function readFavoriteRecipes(): FavoriteRecipe[] {
  if (typeof window === "undefined") {
    return EMPTY_FAVORITE_RECIPES;
  }

  try {
    const storedFavorites = window.localStorage.getItem(FAVORITE_RECIPES_STORAGE_KEY);

    if (!storedFavorites) {
      cachedFavoriteRecipesRawValue = null;
      cachedFavoriteRecipes = EMPTY_FAVORITE_RECIPES;
      return cachedFavoriteRecipes;
    }

    if (storedFavorites === cachedFavoriteRecipesRawValue) {
      return cachedFavoriteRecipes;
    }

    const parsedFavorites: unknown = JSON.parse(storedFavorites);

    if (!Array.isArray(parsedFavorites)) {
      cachedFavoriteRecipesRawValue = null;
      cachedFavoriteRecipes = EMPTY_FAVORITE_RECIPES;
      return cachedFavoriteRecipes;
    }

    cachedFavoriteRecipesRawValue = storedFavorites;
    cachedFavoriteRecipes = parsedFavorites.filter(isFavoriteRecipe);

    return cachedFavoriteRecipes;
  } catch {
    cachedFavoriteRecipesRawValue = null;
    cachedFavoriteRecipes = EMPTY_FAVORITE_RECIPES;
    return cachedFavoriteRecipes;
  }
}

function writeFavoriteRecipes(favoriteRecipes: FavoriteRecipe[]) {
  cachedFavoriteRecipes = favoriteRecipes;
  cachedFavoriteRecipesRawValue = JSON.stringify(favoriteRecipes);

  window.localStorage.setItem(
    FAVORITE_RECIPES_STORAGE_KEY,
    cachedFavoriteRecipesRawValue
  );
  window.dispatchEvent(new Event(FAVORITE_RECIPES_UPDATED_EVENT));
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStoreChange = () => onStoreChange();

  window.addEventListener("storage", handleStoreChange);
  window.addEventListener(FAVORITE_RECIPES_UPDATED_EVENT, handleStoreChange);

  return () => {
    window.removeEventListener("storage", handleStoreChange);
    window.removeEventListener(FAVORITE_RECIPES_UPDATED_EVENT, handleStoreChange);
  };
}

function getServerSnapshot(): FavoriteRecipe[] {
  return EMPTY_FAVORITE_RECIPES;
}

export function useFavoriteRecipes() {
  const favoriteRecipes = useSyncExternalStore(
    subscribe,
    readFavoriteRecipes,
    getServerSnapshot
  );

  const isFavorite = (recipeId: string) =>
    favoriteRecipes.some((recipe) => recipe.idMeal === recipeId);

  const toggleFavorite = (recipe: FavoriteRecipe) => {
    const nextFavorites = isFavorite(recipe.idMeal)
      ? favoriteRecipes.filter((favorite) => favorite.idMeal !== recipe.idMeal)
      : [
          recipe,
          ...favoriteRecipes.filter((favorite) => favorite.idMeal !== recipe.idMeal),
        ];

    writeFavoriteRecipes(nextFavorites);
  };

  return {
    favoriteRecipes,
    favoriteCount: favoriteRecipes.length,
    isFavorite,
    toggleFavorite,
  };
}
