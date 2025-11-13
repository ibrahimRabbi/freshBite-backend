"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRecipeInMealPlanController = exports.deleteMealPlanController = exports.getMealPlanController = exports.createMealPlanController = void 0;
const catchAsync_1 = require("../../helper/catchAsync");
const plan_services_1 = require("./plan.services");
const http_status_1 = __importDefault(require("http-status"));
const plan_model_1 = __importDefault(require("./plan.model"));
exports.createMealPlanController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const creating = yield (0, plan_services_1.createMealPlanServices)(req);
    if (!creating) {
        throw new Error('faild to create meal plan');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'meal plan created successfully',
        data: creating
    });
}));
exports.getMealPlanController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const finding = yield plan_model_1.default.findOne({ userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id }, { meals: { $elemMatch: { date: new Date((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.date) } } });
    if (!finding) {
        throw new Error('faild to get meal plan');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'meal plan retrived successfully',
        data: finding
    });
}));
exports.deleteMealPlanController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const finding = yield plan_model_1.default.findOneAndUpdate({
        userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id,
        'meals.date': new Date((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.date),
    }, {
        $pull: {
            'meals.$.recipes': (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.recipeId
        }
    }, { new: true });
    if (!finding) {
        throw new Error('faild to deleted meal plan');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'meal plan deleted successfully',
        data: finding
    });
}));
exports.addRecipeInMealPlanController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const checkExistancy = yield Promise.all(((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.meals) === null || _b === void 0 ? void 0 : _b.map((object) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const finding = yield plan_model_1.default.findOne({
            userId: req === null || req === void 0 ? void 0 : req.user._id,
            'meals.date': object === null || object === void 0 ? void 0 : object.date,
            'meals.meal_time': object === null || object === void 0 ? void 0 : object.meal_time,
            'meals.recipes': { $in: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.recipes }
        }).lean();
        if (finding) {
            throw new Error('this plan already created for this date');
        }
        else {
            const plans = Object.assign(Object.assign({}, object), { recipes: [(_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.recipes], comments: [] });
            // if(finding.meals.recipes.includes(req?.body?.recipes)){
            // }
            const pushingRecipe = yield plan_model_1.default.findOneAndUpdate({ userId: req === null || req === void 0 ? void 0 : req.user._id }, { $push: { meals: plans } }, { new: true });
            return pushingRecipe;
        }
        // } else {
        //    throw new Error('this plan already created for this date')
        //    // const updatedMealPlan = await mealPlanModel.findOneAndUpdate(
        //    //    {
        //    //       userId: req?.user._id,
        //    //       'meals.date': object?.date,
        //    //       'meals.meal_time': object?.meal_time
        //    //    },
        //    //    {
        //    //       $push: { 'meals.$.recipes': req?.body?.recipes }
        //    //    },
        //    //    { new: true }
        //    // );
        //    // return updatedMealPlan;
        // }
    }))) || []);
    if (!checkExistancy) {
        throw new Error('faild to add meal plan');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'meal plan deleted successfully',
        data: checkExistancy
    });
}));
