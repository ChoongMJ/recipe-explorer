// TheMealDB API types
export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
  ingredients: { ingredient: string; measure: string }[];
}

export interface RecipeListResponse {
  meals: {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  }[];
}

export interface RecipeDetailResponse {
  meals: {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string;
    strYoutube: string;
    [key: string]: string | null;
  }[];
}

// Format a single recipe to include the ingredients array
const formatRecipe = (meal: RecipeDetailResponse["meals"][0]): Recipe => {
  const ingredients: { ingredient: string; measure: string }[] = [];

  // Extract ingredients and measures
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof typeof meal];
    const measure = meal[`strMeasure${i}` as keyof typeof meal];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient as string,
        measure: (measure as string) || "",
      });
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
    strInstructions: meal.strInstructions,
    strMealThumb: meal.strMealThumb,
    strTags: meal.strTags || "",
    strYoutube: meal.strYoutube || "",
    ingredients,
  };
};

// Add this to your existing API service
interface FeedbackData {
  name: string;
  email: string;
  recipeId?: string;
  rating: number;
  comments: string;
  improvements: string;
  subscribe: boolean;
}

// API service for TheMealDB
const API = {
  // Get all recipes (only returns basic info)
  getRecipes: async (): Promise<RecipeListResponse> => {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    
    return response.json();
  },

  // Get a single recipe by ID
  getRecipeById: async (id: string): Promise<Recipe> => {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch recipe");
    }
    
    const data: RecipeDetailResponse = await response.json();
    
    if (!data.meals || data.meals.length === 0) {
      throw new Error("Recipe not found");
    }
    
    return formatRecipe(data.meals[0]);
  },

  // Submit feedback (mocked since the API doesn't have this functionality)
  submitFeedback: async (recipeId: string, feedback: string): Promise<{ success: boolean }> => {
    // This is mocked since the API doesn't support feedback
    console.log(`Feedback for recipe ${recipeId}: ${feedback}`);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return { success: true };
  },
};

export default API; 