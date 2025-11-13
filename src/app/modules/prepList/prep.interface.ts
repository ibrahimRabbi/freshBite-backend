import { Types } from "mongoose";

export type Trecipe = {
    recipeId: Types.ObjectId;
    isDone: boolean;
};

export type TprepList = {
    userId: Types.ObjectId
    date: Date;
    serving: number;
    cooker: Types.ObjectId | 'me';
    recipes: Trecipe[];
    isDeleted: boolean;
};
