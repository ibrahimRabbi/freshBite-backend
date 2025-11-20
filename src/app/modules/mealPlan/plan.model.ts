import mongoose, { Schema, Types } from "mongoose";
import { Tcomments, TmealPlan } from "./plan.intrface";


const TcommentsSchema = new Schema<Tcomments>({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
  },
  isDeleted: { type: "Boolean", default: false }
});



const mealPlanSchema = new Schema<TmealPlan>({
  userId: {
    type: Schema.Types.ObjectId,
    index:true,
    required: [true, 'User ID is required'],
    ref: 'users',
  },

  date: {
    type: Date,
    required: [true, 'Date is required'],
  },

  serving: {
    type: Number,
    required: [true, 'Serving is required'],
    min: [1, 'Serving must be at least 1'],
    max: [10, 'Serving cannot exceed 10'],
  },

  meal_time: {
    type: String,
    required: [true, 'Meal time is required'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    message: '{VALUE} is not a valid meal time',
  },

  recipes: {
    type: [Schema.Types.ObjectId],
    required: [true, 'At least one recipe is required'],
    ref: 'recipes',
    validate: {
      validator: function (value: any) {
        return value.length > 0;
      },
      message: 'At least one recipe is required',
    },
  },

  comments: { type: [TcommentsSchema], default: [] },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});


const mealPlanModel = mongoose.model('mealPlan', mealPlanSchema);





export default mealPlanModel;
