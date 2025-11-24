import express from "express";
import { subscriptionController } from "./subs.controller";

export const subscriptionRoute = express.Router();

subscriptionRoute.post('/', subscriptionController.createSubscription);
subscriptionRoute.get('/', subscriptionController.getAllSubscriptions);
subscriptionRoute.get('/:id', subscriptionController.getSubscriptionById);
// router.patch('/:id', subscriptionController.updateSubscription);
// router.delete('/:id', subscriptionController.deleteSubscription);

 