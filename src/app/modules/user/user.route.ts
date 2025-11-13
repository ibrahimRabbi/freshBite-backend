import { Router } from "express";
import { createUserController, deleteUserController, getAllUserController, getMyProfileController, getSingleUserController, updateUserController } from "./user.controller";
import { authentication } from "../../middleware/authentication";

export const userRoute = Router()

userRoute.post('/create-user', createUserController)
userRoute.patch('/update-user', authentication, updateUserController)
userRoute.get('/get-my-profile', authentication, getMyProfileController)
userRoute.get('/get-single-user/:id', authentication, getSingleUserController)
userRoute.get('/get-all-user', authentication, getAllUserController)
userRoute.patch('/delete-user/:id', authentication, deleteUserController)