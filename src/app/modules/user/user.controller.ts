import { NextFunction, Request, Response } from "express";
import { createUserServices, updateUserServices } from "./user.services";
import status from "http-status";
import { catchAsync } from "../../helper/catchAsync";
import userModel from "./user.model";



export const createUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const createUser = await createUserServices(req?.body)
    if (!createUser) {
        throw new Error('faild to create user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user created successfully',
        token: createUser
    })

})


export const updateUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const updatedUser = await updateUserServices(req)
    if (!updatedUser) {
        throw new Error('faild to create user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user updated successfully',
        token: updatedUser
    })

})



export const getMyProfileController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'profile retrived successfully',
        data: req.user
    })

})

export const getSingleUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (req?.user?.role !== 'admin') {
        throw new Error('unauthorized access')
    }

    const findingUser = await userModel.findById(req?.params?.id)
    if (!findingUser) {
        throw new Error('user not found')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user retrived successfully',
        data: findingUser
    })

})


export const getAllUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (req?.user?.role !== 'admin') {
        throw new Error('unauthorized access')
    }

    const findingUser = await userModel.find({isDeleted:{$ne:true}})
    if (!findingUser) {
        throw new Error('user not found')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'all user retrived successfully',
        data: findingUser
    })

})

export const deleteUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (req?.user?.role !== 'admin') {
        throw new Error('unauthorized access')
    }

    const findingUser = await userModel.findByIdAndUpdate(req?.params?.id, {isDeleted:true},{new:true,runValidators:true,context:'query'})
    if (!findingUser) {
        throw new Error('faild to deleted user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user deleted successfully',
        data: findingUser
    })

})