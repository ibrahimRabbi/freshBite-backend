"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeRoute = void 0;
const express_1 = require("express");
const recipe_controller_1 = require("./recipe.controller");
const authentication_1 = require("../../middleware/authentication");
const fileparser_1 = require("../../helper/fileparser");
exports.recipeRoute = (0, express_1.Router)();
exports.recipeRoute.post('/create-recipe', fileparser_1.placeFile.fields([
    { name: 'recipeimages', maxCount: 4 },
    { name: 'skillsVideo', maxCount: 20 },
]), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, authentication_1.authentication, recipe_controller_1.createrecipeController);
exports.recipeRoute.post('/video-upload', fileparser_1.placeFile.single('skillVideos'), authentication_1.authentication, recipe_controller_1.videoUploadController);
exports.recipeRoute.get('/get-single-recipe/:id', authentication_1.authentication, recipe_controller_1.getSingleRecipeController);
exports.recipeRoute.get('/get-all-recipe', authentication_1.authentication, recipe_controller_1.getAllRecipeController);
exports.recipeRoute.patch('/update-recipe/:id', authentication_1.authentication, recipe_controller_1.updateRecipeController);
exports.recipeRoute.patch('/delete-recipe/:id', authentication_1.authentication, recipe_controller_1.deleteRecipeController);
