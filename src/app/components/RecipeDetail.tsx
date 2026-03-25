"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon, LoaderCircleIcon } from "lucide-react";

import API from "../services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function RecipeDetail() {
  const { id } = useParams();

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => API.getRecipeById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoaderCircleIcon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load recipe</AlertTitle>
        <AlertDescription>
          Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6 inline-flex")}
      >
        <ArrowLeftIcon className="size-4" />
        Back to recipes
      </Link>

      <Card className="overflow-hidden py-0">
        <div className="md:grid md:grid-cols-2">
          <div className="relative h-64 w-full md:h-full">
            <Image
              src={recipe?.strMealThumb ?? ""}
              alt={recipe?.strMeal ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <CardContent className="p-6">
            <CardTitle className="text-3xl">{recipe?.strMeal ?? ""}</CardTitle>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">{recipe?.strCategory ?? ""}</Badge>
              <Badge variant="outline">{recipe?.strArea ?? ""}</Badge>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">Ingredients</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {recipe?.ingredients.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                    <span>
                      <span className="font-medium text-foreground">{item.measure}</span>{" "}
                      {item.ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </div>

        <Separator />

        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="mb-3 text-xl font-semibold">Instructions</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {recipe?.strInstructions ?? ""}
            </p>
          </div>

          {recipe?.strYoutube && (
            <div>
              <h2 className="mb-3 text-xl font-semibold">Video Tutorial</h2>
              <a
                href={recipe?.strYoutube ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "inline-flex")}
              >
                <ExternalLinkIcon className="size-4" />
                Watch on YouTube
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
