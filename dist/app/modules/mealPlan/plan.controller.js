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
exports.deleteMealPlanController = exports.getMealPlanController = exports.createMealPlanController = void 0;
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
    const finding = yield plan_model_1.default.findOne({ userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, date: new Date((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.date) });
    if (!finding) {
        throw new Error('this date of data is not exist');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'meal plan retrived successfully',
        data: finding
    });
}));
exports.deleteMealPlanController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const deletign = yield plan_model_1.default.findByIdAndUpdate(req === null || req === void 0 ? void 0 : req.params.id, { $pull: { recipes: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.recipeId } }, { new: true });
    if (!deletign) {
        throw new Error('faild to deleted meal plan');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'meal plan deleted successfully',
        data: deletign
    });
}));
// export const addRecipeInMealPlanController: RequestHandler = catchAsync(async (req, res, next) => {
//    // const checkExistancy = await Promise.all(
//    //    req.body?.meals?.map(async (object: Tmeals) => {
//    //       const finding = await mealPlanModel.findOne({
//    //          userId: req?.user._id,
//    //          'meals.date': object?.date,
//    //          'meals.meal_time': object?.meal_time,
//    //       }).lean() as { meals: Tmeals[] } | null;
//    //       const recipeId = new mongoose.Types.ObjectId(req?.body?.recipes);
//    //       if (finding && finding.meals) {
//    //          for (const value of finding.meals) {
//    //             if (value.recipes.some((recipe: mongoose.Types.ObjectId) => recipe.equals(recipeId))) {
//    //                throw new Error('This plan already created for this date');
//    //             }
//    //          }
//    //          const updatedMealPlan = await mealPlanModel.findOneAndUpdate(
//    //             {
//    //                userId: req?.user._id,
//    //                'meals.date': object?.date,
//    //                'meals.meal_time': object?.meal_time
//    //             },
//    //             {
//    //                $push: { 'meals.$.recipes': recipeId }
//    //             },
//    //             { new: true }
//    //          );
//    //          return updatedMealPlan;
//    //       } else {
//    //          const plans = {
//    //             ...object,
//    //             recipes: [recipeId],
//    //          };
//    //          const pushingRecipe = await mealPlanModel.findOneAndUpdate(
//    //             { userId: req?.user._id },
//    //             { $push: { meals: plans } },
//    //             { new: true }
//    //          );
//    //          return pushingRecipe;
//    //       }
//    //    })
//    // );
//    const checkprepList = await PrepListModel.findOne({ userId: req?.user?._id, date: req?.body.prepList?.date })
//    const prepData: TprepList = {
//       userId: req?.user._id,
//       ...req?.body?.prepList,
//       recipes: [{ recipeId: req?.body?.recipes, isDone: false }],
//       isDeleted: false
//    };
//    if (checkprepList) {
//       const updateList = await PrepListModel.findOneAndUpdate(
//          { userId: req?.user?._id, date: req?.body.prepList?.date },
//          { $push: { recipes: { recipeId: req?.body?.recipes, isDone: false } } },
//          { new: true })
//       if (!updateList) {
//          throw new Error('faild to update prep List')
//       }
//    } else {
//       const createList = await PrepListModel.create(prepData);
//       if (!createList) {
//          throw new Error('faild to create prep List')
//       }
//    }
//    // if (!checkExistancy) {
//    //    throw new Error('faild to add meal plan')
//    // }
//    res.status(status.OK).json({
//       success: true,
//       status: status.OK,
//       message: 'plan has been updated successfully',
//       // data: checkExistancy
//    })
// })
