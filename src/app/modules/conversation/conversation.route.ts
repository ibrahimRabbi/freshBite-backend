import { Router } from "express";
import { fetchAllConversationController } from "./conversation.controller";
import { authentication } from "../../middleware/authentication";

export const conversationRoute = Router()

conversationRoute.get('/get-conversations', authentication, fetchAllConversationController)