import { Types } from "mongoose"
import { RecipeIngredient } from "../recipe/recipe.inteface";

export type Tlist = {
    name: string;
    ingredient: [RecipeIngredient]
}

export type TshoppingList = {
    userId: Types.ObjectId;
    title: string,
    description: string;
    date: Date;
    coocker : any;
    coverImages: string
    list: Tlist[];
    isDone: boolean;
    isDeleted: boolean;
}