import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import PrepListModel from "./prep.model";
import status from "http-status";

export const getPrepListController: RequestHandler = catchAsync(async (req, res, next) => {
    const findinList = await PrepListModel.findOne({ userId: req?.user?._id, ...req.body }).populate('recipes.recipeId')
    if (findinList === null) {
        res.status(status.NOT_FOUND).json({
            status: status.NOT_FOUND,
            success: true,
            message: 'has no any Data',
            data: {}
        })
    }

    res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'Prep List Data Retrive successfull',
      data: findinList
   })
})