import mongoose, { Schema, Document, Types } from "mongoose";


const TcommentsSchema: Schema = new Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});


const TmealsSchema: Schema = new Schema({
  date: {
    type: Date,
    required: [true, 'Meal date is required'],
  },
  serving: {
    type: Number,
    required: [true, 'Serving number is required'],
  },
  meal_time: {
    type: String,
    required: [true, 'Meal time is required'],
    enum: {
      values : ['breakfast', 'lunch', 'dinner', 'snack'],
      message : '{VALUE} is not valid meal time'
    },
  },
  recipes: {type: [Types.ObjectId],ref: 'recipes', required: [true, 'Recipes are required']},
  comments: {type: [TcommentsSchema],default: []},
});


const MealPlanSchema: Schema = new Schema({
  userId: { type: Types.ObjectId, ref: 'users',  required: [true, 'User ID is required'], },
  meals: {type: [TmealsSchema], required: [true, 'Meals are required'], },
  isDeleted: { type: Boolean,default: false,}
}, {timestamps: true,});


const mealPlanModel = mongoose.model('mealPlan', MealPlanSchema);
export default mealPlanModel;
