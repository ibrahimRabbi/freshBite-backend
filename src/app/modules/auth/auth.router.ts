import { Router } from "express";
import { forgetPasswordController, signInController, verifyOtpController } from "./auth.controller";

export const authRoute = Router()

authRoute.post('/sign-in', signInController)
authRoute.post('/forget-password',forgetPasswordController)
authRoute.post('/verify-otp',verifyOtpController)
