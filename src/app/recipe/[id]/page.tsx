import RecipeDetail from "@/app/components/RecipeDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Detail | Recipe Explorer Lite",
  description: "View detailed recipe information",
};

export default function RecipePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <RecipeDetail id={params.id} />
    </div>
  );
} 