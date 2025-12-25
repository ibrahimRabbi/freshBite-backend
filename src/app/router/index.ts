import { Router } from "express";
import { authRoute } from "../modules/auth/auth.router";
import { userRoute } from "../modules/user/user.route";
import { settingsRoute } from "../modules/settings/settings.route";
 
import { postRoute } from "../modules/post/post.route";
import { conversationRoute } from "../modules/conversation/conversation.route";
import { productRoute } from "../modules/store/store.route";
import { friendRoute } from "../modules/friends/friend.route";
 

export const router = Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/settings', settingsRoute)
router.use('/post', postRoute)
router.use('/conversation', conversationRoute)
router.use('/products', productRoute)
router.use('/friends', friendRoute)

router.get('/', (req, res) => {
    res.json({ title: 'hello world welcome to dating server' })
})