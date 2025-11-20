import { Router } from "express";
import { creatGroceryController, getGroceryController } from "./grocery.controller";
import { authentication } from "../../middleware/authentication";

export const groceryRoute = Router()

groceryRoute.post('/create-grocery', authentication, creatGroceryController)  
groceryRoute.get('/get-grocery', authentication, getGroceryController)  


