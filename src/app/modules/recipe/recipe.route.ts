import { NextFunction, Request, Response, Router } from "express";
import { createrecipeController, deleteRecipeController, getAllRecipeController, getSingleRecipeController, updateRecipeController } from "./recipe.controller";
import { authentication } from "../../middleware/authentication";
import { placeFile } from "../../helper/fileparser";

export const recipeRoute = Router()



recipeRoute.post(
    '/create-recipe',
   
    placeFile.fields([
        { name: 'images', maxCount: 1 },
        { name: 'images2', maxCount: 1 },
    ]),
     (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
     authentication,
     createrecipeController
    )

recipeRoute.get('/get-single-recipe/:id', authentication, getSingleRecipeController)

recipeRoute.get('/get-all-recipe', authentication, getAllRecipeController)

recipeRoute.patch('/update-recipe/:id', authentication, updateRecipeController)

recipeRoute.patch('/delete-recipe/:id', authentication, deleteRecipeController)

