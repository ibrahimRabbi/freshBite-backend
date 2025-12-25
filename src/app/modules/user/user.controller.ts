import { NextFunction, Request, RequestHandler, Response } from "express";
import { createUserServices, signUpOtpServices, } from "./user.services";
import status from "http-status";
import { catchAsync } from "../../helper/catchAsync";
import userModel from "./user.model";
import { Tuser } from "./user.interface";
import subscriptionModel from "../subscription/subs.model";
import { uploadImage } from "../../helper/imageUploader";
import mongoose from "mongoose";



export const createUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const createUser = await createUserServices(req?.body)
    if (!createUser) {
        throw new Error('faild to create user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'has been sent verification code to your email',
        verificationToken: createUser
    })

})

export const signUpOtpController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const createUser = await signUpOtpServices(req)
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

export const imageUploadController: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error('please provide an image')
    }

    const imageNamePrefix = `${req?.body?.title}_${Math.random().toString().split('.')[1]}`;
    const Imagefiles = Array.isArray(req?.files) ? (req.files as Express.Multer.File[]) : (req?.files as { [fieldname: string]: Express.Multer.File[] })?.images || [];


    const imageUrls = await Promise.all(
        Imagefiles.map(async (file) => {
            const result = await uploadImage(file?.path, `${imageNamePrefix}`);
            return result.secure_url;
        })
    );


    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'image uploaded successfully',
        data: imageUrls
    })
});

export const subscriptionController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const subscription = await subscriptionModel.findById(req.body?.id)
    if (!subscription) {
        throw new Error('subscription plan not found')
    }


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

export const getSingleUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

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

export const matchUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const myInformation = req?.user

    const findingUser = await userModel.find({
        isDeleted: { $ne: true },
        blockedUsers: { $nin: [myInformation?._id] },
        blockedMe: { $nin: [myInformation?._id] },
        gender: { $ne: myInformation?.gender },
        age: { $lte: myInformation?.age }, //will do modify later for better matching
        orientation: myInformation?.orientation,
        relationshipStatus: myInformation?.relationshipStatus,
    })
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

export const blockUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();


        const blockingUser = await userModel.findByIdAndUpdate(
            req?.user?._id,
            { $addToSet: { blockedUsers: req.body.userId } },
            { new: true, runValidators: true, context: 'query', session }
        );

        if (!blockingUser) {
            throw new Error('Failed to block user');
        }


        const updateUserBlockedMe = await userModel.findByIdAndUpdate(
            req?.body?.userId,
            { $addToSet: { blockedMe: req?.user?._id } },
            { new: true, runValidators: true, context: 'query', session }
        );

        if (!updateUserBlockedMe) {
            throw new Error('Failed to update blocked user');
        }


        await session.commitTransaction();
        await session.endSession()

        res.status(status.OK).json({
            success: true,
            status: status.OK,
            message: 'User blocked successfully',
            data: blockingUser
        });

    } catch (error) {

        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
});

export const saveduserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const echeckExisting = await userModel.findOne({ savedUser: { $in: [req.body.userId] } })
    if (echeckExisting) {
        throw new Error('user already saved')
    }

    const savedUser = await userModel.findByIdAndUpdate(req?.user?._id, { $push: { savedUser: req.body.userId } }, { new: true, runValidators: true, context: 'query' })
    if (!savedUser) {
        throw new Error('faild to saved user')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'Saved successfully',
        data: savedUser
    })


})

export const getSavedUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const savedUser = await userModel.findById(req?.user?._id).populate('savedUser').select('savedUser -_id')

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'user Saved successfully',
        data: savedUser
    })

})

export const getAllUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const queryData: any = {
        gender: { $ne: req?.user?.gender },
        isDeleted: { $ne: true },
        blockedUsers: { $nin: [req?.user?._id] },
        blockedMe: { $nin: [req?.user?._id] },
        
    };

    if(req?.query?.distance) {
        const distance = parseInt(req?.query?.distance as string);
        if (!isNaN(distance)) {
            queryData.address = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: req.user?.address?.coordinates
                },
                $maxDistance: distance
            }
        }
    }
}


    if (req?.query?.startAgerange && req?.query?.endAgerange) {
        const startAge = parseInt(req?.query?.startAgerange as string);
        const endAge = parseInt(req?.query?.endAgerange as string);

        if (!isNaN(startAge) && !isNaN(endAge)) {
            queryData.age = { $gte: startAge, $lte: endAge };
        }
    }

    const findingUser = await userModel.find(queryData)
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














// export const singleImageUploadController: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     if (!req.file) {
//         throw new Error('please provide an image')
//     }

//     const uploaded = await uploadImage(req.file?.path as string, 'profile_images')
//     if (!uploaded) {
//         throw new Error('faild to upload image')
//     }

//     res.status(status.OK).json({
//         success: true,
//         status: status.OK,
//         message: 'image uploaded successfully',
//         data: uploaded?.secure_url
//     })
// })

