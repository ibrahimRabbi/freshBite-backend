import { Types } from "mongoose";
import { RecipeIngredient } from "../recipe/recipe.inteface";
 

export type TList = {
    recipeName: string;
    ingredients: RecipeIngredient[];
}

export type TGrocery = {
    userId: Types.ObjectId;
    date: Date;
    list: TList[];
}