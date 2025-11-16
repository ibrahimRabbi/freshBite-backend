import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import status from "http-status";
import { forgetPasswordService, signInService, updateUserServices, verifyOtpServices } from "./auth.service";
import userModel from "../user/user.model";


export const signInController: RequestHandler = catchAsync(async (req, res, next) => {

    const signin = await signInService(req.body);

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: "sign in successfully",
        token: signin
    });

})

export const forgetPasswordController: RequestHandler = catchAsync(async (req, res, next) => {

    const verificationToken = await forgetPasswordService(req);

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: "we have sent email verification code to your email",
        verificationToken
    });

})

export const verifyOtpController: RequestHandler = catchAsync(async (req, res, next) => {

    const verifyOtp= await verifyOtpServices(req);

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: "otp verified successfully",
        
    });

})

export const updateProfileController: RequestHandler = catchAsync(async (req, res, next) => {

    const updating = await updateUserServices(req)
   
    if (!updating) {
        throw new Error('faild to update profile')
    }

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: "profile has been updated",
        data : updating
    });

})

export const changePasswordController:RequestHandler = catchAsync(async(req,res,next)=>{

    const findUser = await userModel.findById(req?.user?._id).select('password')
    if(!findUser){
         throw new Error('something went erong')
    }
      
    if(findUser?.password !== req?.body?.currentPassword){
        throw new Error('invalid current password')
    }

    const updatePassword = await userModel.findByIdAndUpdate(findUser?._id, {password:req?.body?.newPassword}, {new:true, runValidators:true, context:'query'})
    if(!updatePassword){
        throw new Error('faild to update password')
    }

     res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'password has been changed',
        data: updatePassword
    })

})

export const getMyProfileController :RequestHandler = catchAsync(async (req, res, next) => {

    res.status(status.OK).json({
        success: true,
        status: status.OK,
        message: 'profile retrived successfully',
        data: req.user
    })

})
