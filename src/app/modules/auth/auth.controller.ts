import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import status from "http-status";
import { forgetPasswordService, signInService, verifyOtpServices } from "./auth.service";


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

