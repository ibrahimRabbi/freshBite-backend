import { Schema, model } from "mongoose";
import { Tlist, TshoppingList } from "./shopping.interface";
import { RecipeIngredientSchema } from "../recipe/recipe.model";

const listSchema = new Schema<Tlist>({
  name: { type: String, required: [true, "List name is required"] },
  ingredient: { type: [RecipeIngredientSchema], _id: false, required: [true, "Ingredient list is required"] }
}, { _id: false });

const shoppingListSchema = new Schema<TshoppingList>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User ID is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [1, "Title must be at least 1 character long"],
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [1, "Description must be at least 1 character long"],
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now,
  },
  coocker: { type: Schema.Types.Mixed, required: true },
  coverImages: {
    type: String,
    required: [true, "Cover image is required"],
  },
  list: { type: [listSchema], required: [true, "ingredient list is required"] },
  isDone: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const ShoppingList = model<TshoppingList>("shoppingLists", shoppingListSchema);