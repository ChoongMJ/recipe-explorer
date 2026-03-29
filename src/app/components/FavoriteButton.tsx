"use client";

import { HeartIcon } from "lucide-react";

import type { RecipeSummary } from "@/app/services/api";
import { Button } from "@/components/ui/button";
import { useFavoriteRecipes } from "@/hooks/useFavoriteRecipes";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  recipe: RecipeSummary;
  className?: string;
  showLabel?: boolean;
}

export default function FavoriteButton({
  recipe,
  className,
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteRecipes();
  const recipeIsFavorite = isFavorite(recipe.idMeal);

  return (
    <Button
      type="button"
      variant="outline"
      size={showLabel ? "lg" : "icon-sm"}
      className={cn(
        "shrink-0 border shadow-sm backdrop-blur-sm transition-colors",
        showLabel
          ? recipeIsFavorite
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/55"
            : "border-border bg-background text-foreground hover:bg-muted dark:bg-background/80"
          : recipeIsFavorite
            ? "border-rose-200/90 bg-background/90 text-rose-600 hover:bg-rose-50/95 dark:border-rose-900/70 dark:bg-background/80 dark:text-rose-300 dark:hover:bg-rose-950/40"
            : "border-border/80 bg-background/90 text-foreground hover:bg-background dark:border-border/70 dark:bg-background/75 dark:text-foreground",
        className
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(recipe);
      }}
      aria-pressed={recipeIsFavorite}
      aria-label={
        recipeIsFavorite
          ? `Remove ${recipe.strMeal} from favorites`
          : `Add ${recipe.strMeal} to favorites`
      }
    >
      <HeartIcon className={cn("size-4", recipeIsFavorite && "fill-current")} />
      {showLabel ? (
        <span>{recipeIsFavorite ? "Remove from favorites" : "Add to favorites"}</span>
      ) : (
        <span className="sr-only">
          {recipeIsFavorite ? "Remove from favorites" : "Add to favorites"}
        </span>
      )}
    </Button>
  );
}
