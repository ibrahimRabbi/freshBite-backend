import { Router } from "express";
import { authentication } from "../../middleware/authentication";
import { createPostController, frindsPostController, getMyPostController } from "./post.controller";

export const postRoute = Router()

postRoute.post('/create-post', authentication, createPostController)
postRoute.get('/my-post', authentication, getMyPostController)
postRoute.get('/friend-post', authentication, frindsPostController)
