import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { createMealPlanServices } from "./plan.services";
import status from "http-status";
import mealPlanModel from "./plan.model";
import { Tmeals } from "./plan.intrface";

export const createMealPlanController: RequestHandler = catchAsync(async (req, res, next) => {

   const creating = await createMealPlanServices(req)
   if (!creating) {
      throw new Error('faild to create meal plan')
   }

   res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'meal plan created successfully',
      data: creating
   })

})

export const getMealPlanController: RequestHandler = catchAsync(async (req, res, next) => {

   const finding = await mealPlanModel.findOne({ userId: req?.user?._id }, { meals: { $elemMatch: { date: new Date(req?.body?.date as string) } } });

   if (!finding) {
      throw new Error('faild to get meal plan')
   }

   res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'meal plan retrived successfully',
      data: finding
   })

})


export const deleteMealPlanController: RequestHandler = catchAsync(async (req, res, next) => {

   const finding = await mealPlanModel.findOneAndUpdate(
      {
         userId: req?.user?._id,
         'meals.date': new Date(req?.body?.date as string),
      },
      {
         $pull: {
            'meals.$.recipes': req?.body?.recipeId
         }
      },
      { new: true }
   );



   if (!finding) {
      throw new Error('faild to deleted meal plan')
   }

   res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'meal plan deleted successfully',
      data: finding
   })

})


export const addRecipeInMealPlanController: RequestHandler = catchAsync(async (req, res, next) => {

   const checkExistancy = await Promise.all(

      req.body?.meals?.map(async (object: Tmeals) => {
         const finding = await mealPlanModel.findOne({
            userId: req?.user._id,
            'meals.date': object?.date,
            'meals.meal_time': object?.meal_time,
            'meals.recipes': { $in: req?.body?.recipes }
         }).lean();

         if (finding) {
            throw new Error('this plan already created for this date')
         } else {
            const plans = {
               ...object,
               recipes: [req?.body?.recipes],
               comments: []

            }

            // if(finding.meals.recipes.includes(req?.body?.recipes)){
               
            // }
             

            const pushingRecipe = await mealPlanModel.findOneAndUpdate(
               { userId: req?.user._id },
               { $push: { meals: plans } },
               { new: true }
            )
            return pushingRecipe
         }

         


         // } else {
         //    throw new Error('this plan already created for this date')
         //    // const updatedMealPlan = await mealPlanModel.findOneAndUpdate(
         //    //    {
         //    //       userId: req?.user._id,
         //    //       'meals.date': object?.date,
         //    //       'meals.meal_time': object?.meal_time
         //    //    },
         //    //    {
         //    //       $push: { 'meals.$.recipes': req?.body?.recipes }
         //    //    },
         //    //    { new: true }
         //    // );
         //    // return updatedMealPlan;
         // }

      }) || []
   );

   if (!checkExistancy) {
      throw new Error('faild to add meal plan')
   }

   res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'meal plan deleted successfully',
      data: checkExistancy
   })

})

