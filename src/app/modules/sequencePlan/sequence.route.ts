import { Router } from "express";
import { getSequenceMealController, NestedMealCreateController, sequenceMealCreateController } from "./sequence.controller";
import { authentication } from "../../middleware/authentication";

export const sequenceMealRoute = Router()

sequenceMealRoute.post('/create-sequence-meal', authentication, sequenceMealCreateController)
sequenceMealRoute.post('/create-nested-meal', authentication, NestedMealCreateController)
sequenceMealRoute.get('/get-sequence-meal', authentication, getSequenceMealController)