import mongoose, { Schema, Types } from "mongoose";
import { TprepList, Trecipe } from "./prep.interface";

const RecipeSchema: Schema = new Schema<Trecipe>({
  recipeId: { type: Schema.Types.ObjectId, ref: 'recipes', required: [true, 'Recipe ID is required'],},
  isDone: {
    type: Boolean,
    required: [true, 'isDone status is required'],
    default: false,
  },
}, {_id:false});

const PrepListSchema: Schema = new Schema<TprepList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    serving: {
      type: Number,
      required: [true, 'Serving number is required'],
    },
    cooker: {
      type: Schema.Types.Mixed,
      required: [true, 'Cooker (user or "me") is required'],
    },
    recipes: {
      type: [RecipeSchema],
      required: [true, 'Recipes are required'],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);



const PrepListModel = mongoose.model('PrepList', PrepListSchema);

export default PrepListModel;
