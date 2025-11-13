import { Router } from "express";
import { addRecipeInMealPlanController, createMealPlanController, deleteMealPlanController, getMealPlanController } from "./plan.controller";
import { authentication } from "../../middleware/authentication";

export const mealPlanRoute = Router()

mealPlanRoute.post('/create-meal', authentication, createMealPlanController)

mealPlanRoute.get('/get-meal-plan', authentication, getMealPlanController)

mealPlanRoute.patch('/delete-meal-plan',authentication, deleteMealPlanController)

mealPlanRoute.patch('/add-meal-plan',authentication, addRecipeInMealPlanController)