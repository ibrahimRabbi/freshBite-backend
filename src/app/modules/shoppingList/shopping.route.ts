import { NextFunction, Request, Response, Router } from "express";
import { 
  createShoppingListController, 
  deleteShoppingListController, 
  getMyShoppingListsController, 
  getSingleShoppingListController, 
  updateShoppingListController 
} from "./shopping.controller";
import { authentication } from "../../middleware/authentication";
import { placeFile } from "../../helper/fileparser";

export const shoppingListRoute = Router()


shoppingListRoute.post(
  '/create-shopping-list',
  placeFile.single('coverImage'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  authentication,
  createShoppingListController
);

shoppingListRoute.get('/get-my-shopping-lists', authentication, getMyShoppingListsController);

shoppingListRoute.get('/get-single-shopping-list/:id', authentication, getSingleShoppingListController);

shoppingListRoute.patch(
  '/update-shopping-list/:id',
  placeFile.single('coverImage'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  authentication,
  updateShoppingListController
);

shoppingListRoute.patch('/delete-shopping-list/:id', authentication,deleteShoppingListController);

// // Mark a shopping list as done/not done
// shoppingListRoute.patch(
//   '/mark-shopping-list-done/:id',
//   authentication,
//   markShoppingListAsDoneController
// );