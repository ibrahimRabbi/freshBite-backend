import { NextFunction, Request, Response, Router } from "express";
import { addNoteontroller, addReviewController, createrecipeController, deleteRecipeController, getAllRecipeController, getSingleRecipeController, updateRecipeController, videoUploadController } from "./recipe.controller";
import { authentication } from "../../middleware/authentication";
import { placeFile } from "../../helper/fileparser";

export const recipeRoute = Router()



recipeRoute.post(
    '/create-recipe',

    placeFile.fields([
        { name: 'recipeimages', maxCount: 4 },
        { name: 'skillsVideo', maxCount: 20 },
    ]),

    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },

    authentication,
    createrecipeController
)

recipeRoute.post(
    '/video-upload',
    placeFile.single('skillVideos'),
    authentication,
    videoUploadController
)

recipeRoute.get('/get-single-recipe/:id', authentication, getSingleRecipeController)

recipeRoute.get('/get-all-recipe', authentication, getAllRecipeController)

recipeRoute.patch('/update-recipe/:id', authentication, updateRecipeController)

recipeRoute.patch('/delete-recipe/:id', authentication, deleteRecipeController)

recipeRoute.patch('/add-review/:id', authentication, addReviewController)

recipeRoute.patch('/add-note/:id', authentication, addNoteontroller)

