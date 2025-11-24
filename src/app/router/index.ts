import { Router } from "express";
import { authRoute } from "../modules/auth/auth.router";
import { userRoute } from "../modules/user/user.route";
import { recipeRoute } from "../modules/recipe/recipe.route";
import { mealPlanRoute } from "../modules/mealPlan/plan.router";
import { sequenceMealRoute } from "../modules/sequencePlan/sequence.route";
import { prepListRoute } from "../modules/prepList/prep.router";
import { groceryRoute } from "../modules/groceryList/grocery.route";
import { shoppingListRoute } from "../modules/shoppingList/shopping.route";
import { subscriptionRoute } from "../modules/subscription/subs.route";


export const router = Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/recipe', recipeRoute)
router.use('/preplist', prepListRoute)
router.use('/mealplan',mealPlanRoute)
router.use('/sequence', sequenceMealRoute)
router.use('/grocery', groceryRoute)
router.use ('/shopping', shoppingListRoute)
router.use ('/subscription', subscriptionRoute)

router.get('/', (req, res) => {
    res.json({ title: 'hello world welcome to freshBite server' })
})