import { NextFunction, Request, Response, Router } from "express";
import { createUserRecipeController, deleteUserRecipeController, getUserRecipeController } from "./userRecipe.controller";
import { authentication } from "../../middleware/authentication";
import { placeFile } from "../../helper/fileparser";


export const userRecipeRoute = Router()


userRecipeRoute.post(
    '/create-recipe',
    placeFile.fields([
        { name: 'recipeimages', maxCount: 4 },
    ]),

    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    authentication,
    createUserRecipeController)

userRecipeRoute.get('/get-recipes', authentication, getUserRecipeController);
userRecipeRoute.patch('/delete-recipes', authentication, deleteUserRecipeController);