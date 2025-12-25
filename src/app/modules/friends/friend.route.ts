import { Router } from "express";
import { accaptFriendReqcontoller, getFriendListcontoller, getFriendReqcontoller, sentFriendReqcontoller } from "./friend.controller";
import { authentication } from "../../middleware/authentication";

 export const friendRoute = Router();


 friendRoute.post("/send-request", authentication, sentFriendReqcontoller) 
 friendRoute.get("/get-request", authentication, getFriendReqcontoller)
 friendRoute.patch("/accept-request", authentication, accaptFriendReqcontoller)
 friendRoute.get("/get-friend-list", authentication, getFriendListcontoller)