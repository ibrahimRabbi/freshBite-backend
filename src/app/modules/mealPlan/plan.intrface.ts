import { Types } from "mongoose";


type Tcomments = {
    text:string,
    isDeleted : true
}

type Tmeals = {
  date: Date;
  serving: number;
  meal_time: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipes: Types.ObjectId[];
  comments: Tcomments[];
};
 

type MealPlan = {
  userId: Types.ObjectId;
  meals: Tmeals[];
  isDeleted: boolean;
};

export type {
  Tmeals,
  MealPlan, 
};