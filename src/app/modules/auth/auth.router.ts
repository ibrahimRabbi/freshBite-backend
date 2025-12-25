import { Router } from "express";
import { changePasswordController, forgetPasswordController, getMyProfileController, resetPasswordController, signInController, updateProfileController, verifyOtpController } from "./auth.controller";
import { authentication } from "../../middleware/authentication";
import { placeFile } from "../../helper/fileparser";

export const authRoute = Router()

authRoute.post('/sign-in', signInController)
authRoute.post('/forget-password',forgetPasswordController)
authRoute.post('/verify-otp',verifyOtpController)
authRoute.post('/reset-password',resetPasswordController)
authRoute.get('/get-my-profile', authentication, getMyProfileController)

authRoute.patch('/update-profile', placeFile.single('profile'), authentication, updateProfileController)

authRoute.patch('/change-password', authentication, changePasswordController)
