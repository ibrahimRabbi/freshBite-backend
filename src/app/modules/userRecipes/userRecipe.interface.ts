import { Types } from "mongoose";

// Basic ingredient type
interface TUserIngredient {
    name: string;
    unit: string;
    value: string;
}


interface TUserRecipeIngredient {
    name: string;
    unit: string;
    value: string;
    category: string;
}


interface TUserRecipeTime {
    totalTime: string;
    prepTime: string;
    cookTime: string;
}


interface TUserReview {
    rating: number;
    review: string;
    userId: Types.ObjectId;
    isDeleted: boolean;
}


interface TUserNote {
    note: string;
    userId: string;
}


interface TUserNutritionValue {
    name: string;
    unit: string;
    value: string;
}

interface TUserInstruction {
    title: string,
    videoUrl: string
}


interface TUserRecipe {
    userId: Types.ObjectId;
    title: string;
    description: string;
    images: string[];
    allergens: string[];
    tags: string[];
    serving: number;
    ingredients: TUserRecipeIngredient[];
    nutritionValue: [TUserNutritionValue];
    instruction: TUserInstruction[];
    required_skill: [string];
    time: TUserRecipeTime;
    reviews: TUserReview[];
    notes: TUserNote[];
    isDeleted: boolean
}


export type {
    TUserIngredient,
    TUserRecipeIngredient,
    TUserRecipeTime,
    TUserReview,
    TUserNote,
    TUserNutritionValue,
    TUserInstruction,
    TUserRecipe
};