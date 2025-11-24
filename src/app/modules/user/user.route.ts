import { Router } from "express";
import { createChildController, createUserController, deleteUserController, getAllUserController, getChildController, getSingleUserController, subscriptionController} from "./user.controller";
import { authentication } from "../../middleware/authentication";

export const userRoute = Router()

userRoute.post('/create-user', createUserController)
userRoute.get('/get-single-user/:id', authentication, getSingleUserController)
userRoute.get('/get-all-user', authentication, getAllUserController)
userRoute.patch('/delete-user/:id', authentication, deleteUserController)
userRoute.patch('/subscription', authentication, subscriptionController)
userRoute.post('/create-child', authentication, createChildController)
userRoute.get('/get-child', authentication, getChildController)
