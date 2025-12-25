import { Router } from "express";
import {blockUserController, createUserController, deleteUserController, getAllUserController, getSavedUserController, getSingleUserController, imageUploadController, matchUserController, saveduserController, signUpOtpController, subscriptionController,  } from "./user.controller";
import { authentication } from "../../middleware/authentication";
import { placeFile } from "../../helper/fileparser";

export const userRoute = Router()

userRoute.post(
    '/uploads',
    placeFile.fields([{ name: 'images', maxCount: 5 }]),
    imageUploadController
)
userRoute.post('/create-user', createUserController)
userRoute.post('/signup-otp', signUpOtpController)
userRoute.patch('/subscription', authentication, subscriptionController)
userRoute.get('/get-single-user/:id', authentication, getSingleUserController)
userRoute.get('/get-all-user', authentication, getAllUserController)
userRoute.get('/match-user', authentication, matchUserController)
userRoute.patch('/block-user', authentication, blockUserController)
userRoute.patch('/saved-user', authentication, saveduserController)
userRoute.get('/get-saved-user', authentication, getSavedUserController)
userRoute.patch('/delete-user/:id', authentication, deleteUserController)
 

