import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { groceryModel } from "./grocery.model";
import status from "http-status";

export const creatGroceryController: RequestHandler = catchAsync(async (req, res, next) => {
    const creating = await groceryModel.create({ userId: req?.user?._id, ...req.body })
    if (!creating) {
        throw new Error('faild to create grogery Data')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'grocery list created successfully',
        data: creating
    })
})

export const getGroceryController: RequestHandler = catchAsync(async (req, res, next) => {
    const creating = await groceryModel.find({ userId: req?.user?._id })
    if (!creating) {
        throw new Error('faild to get grogery Data')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'grocery list retrive successfully',
        data: creating
    })
})