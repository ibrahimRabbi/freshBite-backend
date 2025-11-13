import { Request } from "express";
import { MealPlan, Tmeals } from "./plan.intrface";
import mealPlanModel from "./plan.model";
import { TprepList } from "../prepList/prep.interface";
import PrepListModel from "../prepList/prep.model";
import mongoose from "mongoose";


export const createMealPlanServices = async (req: Request) => {

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const mealPlanData: MealPlan = {
            userId: req?.user._id,
            meals: req?.body?.meals?.map((value: any) => {
                return {
                    ...value,
                    recipes: [req?.body?.recipes],
                    comments:[]
                };
            }) || [],
            isDeleted: false
        };

        const prepData: TprepList = {
            userId: req?.user._id,
            ...req?.body?.prepList,
            recipes: [{ recipeId: req?.body?.recipes, isDone: false }],
            isDeleted: false
        };


        const creatingMealPlan = await mealPlanModel.create([mealPlanData], { session });
        const createPrepList = await PrepListModel.create([prepData], { session });

        if (!creatingMealPlan || !createPrepList) {
            throw new Error("Failed to create meal plan or prep list");
        }

        await session.commitTransaction();
        await session.endSession()
        return creatingMealPlan;

    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(`Error creating meal plan: ${error.message}`);
    }
};
