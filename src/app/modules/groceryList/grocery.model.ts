import { model, Schema } from "mongoose";
import { TGrocery, TList } from "./grocery.interface";
import { RecipeIngredientSchema } from "../recipe/recipe.model";


const listSchema = new Schema<TList>({
    recipeName: { type: String, required: true },
    ingredients: { type: [RecipeIngredientSchema], required: true }
})

const grocerySchema = new Schema<TGrocery>({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    date: { type: Date, required: true },
    list: { type: [listSchema], required: true }
}, { timestamps: true })

export const groceryModel = model('groceryList', grocerySchema)