import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { createMealPlanServices } from "./plan.services";
import status from "http-status";
import mongoose, { Types } from "mongoose";
import PrepListModel from "../prepList/prep.model";
import { TprepList } from "../prepList/prep.interface";
import mealPlanModel from "./plan.model";


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

   const finding = await mealPlanModel.find({ userId: req?.user?._id, date: new Date(req?.body?.date as string) }).populate('recipes');

   if (!finding) {
      throw new Error('this date of data is not exist')
   }

   res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'meal plan retrived successfully',
      data: finding
   })

})

export const deleteMealPlanController: RequestHandler = catchAsync(async (req, res, next) => {


   const deletign = await mealPlanModel.findByIdAndUpdate(req?.params.id, { $pull: { recipes: req?.body?.recipeId } }, { new: true })

   if (!deletign) {
      throw new Error('faild to deleted meal plan')
   }

   res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'meal plan deleted successfully',
      data: deletign
   })

})


// export const addRecipeInMealPlanController: RequestHandler = catchAsync(async (req, res, next) => {

//    // const checkExistancy = await Promise.all(

//    //    req.body?.meals?.map(async (object: Tmeals) => {

//    //       const finding = await mealPlanModel.findOne({
//    //          userId: req?.user._id,
//    //          'meals.date': object?.date,
//    //          'meals.meal_time': object?.meal_time,
//    //       }).lean() as { meals: Tmeals[] } | null;

//    //       const recipeId = new mongoose.Types.ObjectId(req?.body?.recipes);

//    //       if (finding && finding.meals) {
//    //          for (const value of finding.meals) {
//    //             if (value.recipes.some((recipe: mongoose.Types.ObjectId) => recipe.equals(recipeId))) {
//    //                throw new Error('This plan already created for this date');
//    //             }
//    //          }

//    //          const updatedMealPlan = await mealPlanModel.findOneAndUpdate(
//    //             {
//    //                userId: req?.user._id,
//    //                'meals.date': object?.date,
//    //                'meals.meal_time': object?.meal_time
//    //             },
//    //             {
//    //                $push: { 'meals.$.recipes': recipeId }
//    //             },
//    //             { new: true }
//    //          );

//    //          return updatedMealPlan;
//    //       } else {
//    //          const plans = {
//    //             ...object,
//    //             recipes: [recipeId],
//    //          };

//    //          const pushingRecipe = await mealPlanModel.findOneAndUpdate(
//    //             { userId: req?.user._id },
//    //             { $push: { meals: plans } },
//    //             { new: true }
//    //          );

//    //          return pushingRecipe;
//    //       }


//    //    })
//    // );



//    const checkprepList = await PrepListModel.findOne({ userId: req?.user?._id, date: req?.body.prepList?.date })

//    const prepData: TprepList = {
//       userId: req?.user._id,
//       ...req?.body?.prepList,
//       recipes: [{ recipeId: req?.body?.recipes, isDone: false }],
//       isDeleted: false
//    };

//    if (checkprepList) {
//       const updateList = await PrepListModel.findOneAndUpdate(
//          { userId: req?.user?._id, date: req?.body.prepList?.date },
//          { $push: { recipes: { recipeId: req?.body?.recipes, isDone: false } } },
//          { new: true })

//       if (!updateList) {
//          throw new Error('faild to update prep List')
//       }
//    } else {
//       const createList = await PrepListModel.create(prepData);
//       if (!createList) {
//          throw new Error('faild to create prep List')
//       }
//    }




//    // if (!checkExistancy) {
//    //    throw new Error('faild to add meal plan')
//    // }

//    res.status(status.OK).json({
//       success: true,
//       status: status.OK,
//       message: 'plan has been updated successfully',
//       // data: checkExistancy
//    })

// })

