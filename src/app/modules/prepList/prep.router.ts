import { Router } from "express";
import { authentication } from "../../middleware/authentication";
import { getPrepListController } from "./prepListController";

export const prepListRoute = Router()


prepListRoute.get('/get-prepList', authentication, getPrepListController)