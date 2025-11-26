import { Types } from "mongoose";

// Basic ingredient type
interface Ingredient {
  name: string;
  unit: string;
  value: string;
}

 
interface RecipeIngredient {
  name: string;
  unit: string;
  value: string;
  category: string;
}

 
interface RecipeTime {
  totalTime: string;
  prepTime: string;
  cookTime: string;
}

 
interface Treview {
  rating: number;
  review: string;
  userId: Types.ObjectId;
  isDeleted: boolean;
}

 
interface Note {
  note: string;
  userId: string;
}

 
interface NutritionValue {
  name: string;
  unit: string;
  value: string;
}

interface Tinstruction {
  title: string,
  videoUrl : string
}
 
interface Recipe {
  title: string;
  description: string;
  images: string[];
  allergens: string[];
  tags: string[];
  serving: number;
  ingredients: RecipeIngredient[];
  nutritionValue: [NutritionValue];
  instruction: Tinstruction[];
  required_skill : [string];
  time: RecipeTime;
  reviews: Treview[];
  notes: Note[];
  isDeleted : boolean
}

 
export type {
  Ingredient,
  RecipeIngredient,
  RecipeTime,
  Treview,
  Note,
  NutritionValue,
  Tinstruction,
  Recipe
};