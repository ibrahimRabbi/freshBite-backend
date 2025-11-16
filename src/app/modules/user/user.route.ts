import { Router } from "express";
import { createUserController, deleteUserController, getAllUserController, getSingleUserController} from "./user.controller";
import { authentication } from "../../middleware/authentication";

export const userRoute = Router()

userRoute.post('/create-user', createUserController)
userRoute.get('/get-single-user/:id', authentication, getSingleUserController)
userRoute.get('/get-all-user', authentication, getAllUserController)
userRoute.patch('/delete-user/:id', authentication, deleteUserController)
