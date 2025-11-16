import { Request } from "express";
import mongoose from "mongoose";

import mealPlanModel from "./plan.model";
import { TprepList } from "../prepList/prep.interface";
import PrepListModel from "../prepList/prep.model";
import { TmealPlan } from "./plan.intrface";



export const createMealPlanServices = async (req: Request) => {

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const mealPlanData = req?.body?.meals?.map((value: any) => {
            return {
                userId: req?.user?._id,
                date: value?.date,
                serving: value?.serving,
                meal_time: value?.meal_time,
                recipes: [req?.body?.recipes],
            }
        })


        const prepData: TprepList = {
            userId: req?.user._id,
            ...req?.body?.prepList,
            recipes: [{ recipeId: req?.body?.recipes, isDone: false }],
            isDeleted: false
        };



        //meal plan oparation
        const createdMeal = await Promise.all(mealPlanData.map(async (value: Partial<TmealPlan>) => {
            const checkMealPlan = await mealPlanModel.findOne({
                userId: req?.user?._id,
                date: value?.date,
                meal_time: value?.meal_time,
            }).lean() as TmealPlan | null;

            if (checkMealPlan) {

                const isRecipeExist = checkMealPlan.recipes.some((recipe: any) => req?.body?.recipes.includes(recipe.toString()));

                if (isRecipeExist) {
                    throw new Error('This recipe already exists in the meal plan');
                }


                const updatedMealPlan = await mealPlanModel.findOneAndUpdate(
                    { _id: checkMealPlan._id },
                    { $push: { recipes: req?.body?.recipes } },
                    { new: true, session }
                );

                return updatedMealPlan;
            }


            const creatingMealPlan = await mealPlanModel.create([value], { session });
            return creatingMealPlan[0];
        }));

        if (!createdMeal) {
            throw new Error('faild to created meal plan')
        }


        // prerp List opration
        const checkprepList = await PrepListModel.findOne({ userId: req?.user?._id, date: req?.body.prepList?.date })

        if (checkprepList) {
            await PrepListModel.findOneAndUpdate(
                { userId: req?.user?._id, date: req?.body.prepList?.date },
                { $push: { recipes: { recipeId: req?.body?.recipes, isDone: false } } },
                { new: true })
        } else {
            const createList = await PrepListModel.create([prepData], { session });
            if (!createList) {
                throw new Error("Failed to create meal plan or prep list");
            }
        }




        await session.commitTransaction();
        await session.endSession()
        return createdMeal;

    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        throw new Error(`Error creating meal plan: ${error.message}`);
    }
};
