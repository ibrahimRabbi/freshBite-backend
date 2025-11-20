import { Types } from "mongoose";

export type Tmeal = {
  date: Date;
  meals: [Types.ObjectId];  
};

export type TsequenceMealPlan = {
  userId: Types.ObjectId;
  title: string;
  description: string;
  plans: Tmeal[];
  isDeleted: boolean;
};