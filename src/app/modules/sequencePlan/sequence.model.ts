import { Schema, model, Types } from "mongoose";
import { Tmeal, TsequenceMealPlan } from "./sequence.interface";
 

const MealSchema = new Schema<Tmeal>(
  {
    date: {
      type: Date,
      unique:true,
      required: [true, "Date is required"],
      validate: {
        validator: function(value: Date) {
          return value instanceof Date && !isNaN(value.getTime());
        },
        message: "Invalid date format"
      }
    },
    meals: {
      type: [Schema.Types.ObjectId],
      ref: "mealPlan",
      required: [true, "Meals array is required"],
      validate: {
        validator: function(value: Types.ObjectId[]) {
          return value.length > 0;
        },
        message: "At least one meal is required"
      }
    }
  },
  { _id: false }
);


const SequenceMealPlanSchema = new Schema<TsequenceMealPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      // unique:true,
      ref: "users",
      required: [true, "User ID is required"],
      index: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"]
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },

    plans: {
      type: [MealSchema],
      required: [true, "Plans are required"],
      validate: {
        validator: function(plans: Tmeal[]) {
          return plans.length > 0;
        },
        message: "At least one plan is required"
      }
    },

    isDeleted: { type: Boolean, default: false,}
  },
  {
    timestamps: true,
    // collection: "sequence_meal_plans"
  }
);



export const SequenceMealPlanModel = model<TsequenceMealPlan>(
  "sequenceMealPlans",
  SequenceMealPlanSchema
);






