import { NextFunction, Request, RequestHandler, Response } from "express";
import { createUserServices } from "./user.services";
import status from "http-status";
import { catchAsync } from "../../helper/catchAsync";
import userModel from "./user.model";
import { Tuser } from "./user.interface";
import subscriptionModel from "../subscription/subs.model";
import { generateSlugId } from "../../helper/slugGenerator";
 


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

    const findingUser = await userModel.find({ isDeleted: { $ne: true } })
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

    const findingUser = await userModel.findByIdAndUpdate(req?.params?.id, { isDeleted: true }, { new: true, runValidators: true, context: 'query' })
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

export const subscriptionController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const subscription = await subscriptionModel.findById(req.body?.id)
    if (!subscription) {
        throw new Error('subscription plan not found')
    }

    //  const durationObj = {
    //     monthly: 30,
    //     weekly: 7,
    //     yearly: 365,
    // } as const;

    // type DurationType = keyof typeof durationObj;
    // const durationType: DurationType = (req.body.durationType as DurationType) || 'monthly';


    const value: Partial<Tuser> = {
        expiredAt: new Date(Date.now() + (subscription?.duration as number) * 24 * 60 * 60 * 1000),
        planType: subscription?.plan,
        subscriptionStatus: 'active',
        transectionId: req.body.transectionId || null
    }

    const findingUser = await userModel.findByIdAndUpdate(req?.user?._id, value, { new: true, runValidators: true, context: 'query' });

    if (!findingUser) {
        throw new Error('faild to updated user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user deleted successfully',
        data: findingUser
    })

})

export const createChildController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (req?.user?.planType !== 'family') {
        throw new Error('only family plan user can create child account')
    }

    if (req?.user?.subscriptionStatus !== 'active') {
        throw new Error('your subscription is not active')
    }

    const data = {
        ...req?.body,
        fullName: `${req?.user?.fullName} - child account`,
        phoneNumber: req?.user?.phoneNumber,
        role: 'user',
        planType: req?.user?.planType,
        expiredAt: req?.user?.expiredAt,
        subscriptionStatus: req?.user?.subscriptionStatus,
        parentId: req?.user?._id,
        slug_id: generateSlugId(),
    }

    const createChild = await userModel.create(data)
    if (!createChild) {
        throw new Error('faild to create child account')
    }
    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user created successfully',
        data: createChild
    })

})

export const getChildController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (req?.user?.planType !== 'family') {
        throw new Error('only family plan user can retrive child account')
    }

    if (req?.user?.subscriptionStatus !== 'active') {
        throw new Error('your subscription is not active')
    }


    const getChild = await userModel.find({ parentId: req?.user?._id, isDeleted: { $ne: true } })
    if (!getChild) {
        throw new Error('faild to create child account')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user created successfully',
        data: getChild
    })

})

