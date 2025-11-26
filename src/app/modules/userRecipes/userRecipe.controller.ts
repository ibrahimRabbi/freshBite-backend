import  { RequestHandler } from "express";
import status from "http-status";
import { deleteUserRecipeService, getUserRecipeService } from "./userRecipe.services";
import { catchAsync } from "../../helper/catchAsync";
import { userRecipeModel } from "./userRecipe.model";
import { uploadImage } from "../../helper/imageUploader";



export const createUserRecipeController: RequestHandler = catchAsync(async (req, res, next) => {

    try {
        const checkBefore = await userRecipeModel.findOne({ title: req?.body?.title })
        if (checkBefore) {
            throw new Error('this recipe already exist')
        }

        const imageNamePrefix = `${req?.body?.title}_${Math.random().toString().split('.')[1]}`;
        const RecipeImagefiles = Array.isArray(req?.files) ? (req.files as Express.Multer.File[]) : (req?.files as { [fieldname: string]: Express.Multer.File[] })?.recipeimages;

        const recipeimageUrls = await Promise.all(
            RecipeImagefiles.map(async (file) => {
                const result = await uploadImage(file?.path, `${imageNamePrefix}`);
                return result.secure_url;
            })
        );

        req.body.userId = req?.user?._id;
        req.body.images = recipeimageUrls;

        const creating = await userRecipeModel.create(req?.body)
        if (!creating) {
            throw new Error('faild to create recipe')
        }

        res.status(status.OK).json({
            success: true,
            status: status.OK,
            message: 'recipe created successfully',
            data: creating
        })


    } catch (err: any) {
        throw new Error(err?.message)
    }
});

export const getUserRecipeController: RequestHandler = catchAsync(async (req, res, next) => {

    const recipes = await getUserRecipeService(req);
    res.status(status.OK).json({
        success: true,
        code: status.OK,
        message: "Recipes retrieved successfully",
        response: recipes
    });
});

export const deleteUserRecipeController: RequestHandler = catchAsync(async (req, res, next) => {
   
    const deleted = await deleteUserRecipeService(req);
    res.status(status.OK).json({
        success: true,
        code: status.OK,
        message: "Recipe deleted successfully",
        response: deleted
    });
});