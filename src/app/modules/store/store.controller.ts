import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../helper/catchAsync";
import productsModel from "./store.model";
import status from "http-status";

export const createProductController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const checkBefore = await productsModel.findOne({ name: req.body.name });
    if (checkBefore) {
        throw new Error("Product already exists");
    }

    const product = await productsModel.create(req.body);
    res.status(status.CREATED).json({
        status: status.CREATED,
        success: true,
        message: "Product created successfully",
        data: product,
    });
})

export const getAllProductController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const product = await productsModel.find();
    res.status(status.OK).json({
        status: status.OK,
        success: true,
        message: "Products retrieved successfully",
        data: product,
    });
})