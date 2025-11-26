import { Router } from "express";
import { createSettingsController, getSettingsController, updateSettingsController} from "./settings.controller";
import { authentication } from "../../middleware/authentication";

export const settingsRoute = Router()

settingsRoute.post("/create-setting", authentication, createSettingsController);
settingsRoute.get("/get-setting/:id", authentication, getSettingsController);
settingsRoute.patch("/update-setting", authentication, updateSettingsController)