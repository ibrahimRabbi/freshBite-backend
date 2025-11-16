import { Types } from "mongoose";


type Tcomments = {
  text: string,
  isDeleted: boolean
}



type TmealPlan = {
  _id? : Types.ObjectId
  userId: Types.ObjectId;
  date: Date;
  serving: number;
  meal_time: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipes: Types.ObjectId[];
  comments: Tcomments[];
  isDeleted: boolean;
};

export type {
  TmealPlan,
  Tcomments
};