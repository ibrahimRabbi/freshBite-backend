import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { recipeModel } from "./recipe.model";
import status from "http-status";
import { uploadImage } from "../../helper/imageUploader";
import { uploadVideo } from "../../helper/videoUpload";



export const createrecipeController: RequestHandler = catchAsync(async (req, res, next) => {


    try {
        if (req?.user?.role !== 'admin') {
            throw new Error('Unauthorized Access')
        }

        const checkBefore = await recipeModel.findOne({ title: req?.body?.title })
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

        req.body = { ...(req.body || {}), recipeImages: recipeimageUrls };


        const creating = await recipeModel.create(req?.body)

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

export const videoUploadController: RequestHandler = catchAsync(async (req, res, next) => {

    const imageNamePrefix = (Math.random() * 90000).toString().split('.')[1]


    if (req?.file?.path) {
        const result = await uploadVideo(req?.file?.path, `${imageNamePrefix}`);
         console.log(result)

        res.status(status.OK).json({
            success: true,
            status: status.OK,
            message: 'recipe created successfully',
           url: (result as any)?.secure_url
        }) 
    }else{
        throw new Error('invalid file path')
    }

})

export const getSingleRecipeController: RequestHandler = catchAsync(async (req, res, next) => {
    const finding = await recipeModel.findById(req?.params?.id)
    if (!finding) {
        throw new Error('faild to get recipe')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'recipe retrived successfully',
        data: finding
    })
})

export const getAllRecipeController: RequestHandler = catchAsync(async (req, res, next) => {
    const finding = await recipeModel.find({ isDeleted: { $ne: true } })

    if (!finding) {
        throw new Error('faild to get recipe')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'recipe retrived successfully',
        data: finding
    })
})

export const updateRecipeController: RequestHandler = catchAsync(async (req, res, next) => {

    if (req?.user?.role !== 'admin') {
        throw new Error('Unauthorized Access')
    }



    const updating = await recipeModel.findByIdAndUpdate(req?.params?.id, req.body, { new: true, runValidators: true, context: 'query' })
    if (!updating) {
        throw new Error('faild to create user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'recipe updated successfully',
        data: updating
    })
})

export const deleteRecipeController: RequestHandler = catchAsync(async (req, res, next) => {

    if (req?.user?.role !== 'admin') {
        throw new Error('Unauthorized Access')
    }

    const updating = await recipeModel.findByIdAndUpdate(req?.params?.id, { isDeleted: true }, { new: true, runValidators: true, context: 'query' })
    if (!updating) {
        throw new Error('faild to create user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'recipe updated successfully',
        data: updating
    })
})
