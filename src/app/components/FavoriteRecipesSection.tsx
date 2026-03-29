"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFavoriteRecipes } from "@/hooks/useFavoriteRecipes";

import FavoriteButton from "./FavoriteButton";

export default function FavoriteRecipesSection() {
  const { favoriteRecipes, favoriteCount } = useFavoriteRecipes();

  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Favorites</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved in your browser, so your favorite recipes stay on this device.
          </p>
        </div>
        <Badge variant="outline">
          {favoriteCount} favorite{favoriteCount === 1 ? "" : "s"}
        </Badge>
      </div>

      {favoriteRecipes.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No favorite recipes yet</CardTitle>
            <CardDescription>
              Save a recipe from the list or detail page and it will appear here
              automatically.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteRecipes.map((recipe) => (
            <Card key={recipe.idMeal} className="overflow-hidden py-0">
              <div className="relative h-44 w-full">
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
              </div>

              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link href={`/recipe/${recipe.idMeal}`} className="hover:underline">
                        {recipe.strMeal}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Saved on this device
                    </CardDescription>
                  </div>

                  <FavoriteButton recipe={recipe} />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Link
                  href={`/recipe/${recipe.idMeal}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Open recipe details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
