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
exports.createMealPlanServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const plan_model_1 = __importDefault(require("./plan.model"));
const prep_model_1 = __importDefault(require("../prepList/prep.model"));
const createMealPlanServices = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const mealPlanData = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.meals) === null || _b === void 0 ? void 0 : _b.map((value) => {
            var _a, _b;
            return {
                userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id,
                date: value === null || value === void 0 ? void 0 : value.date,
                serving: value === null || value === void 0 ? void 0 : value.serving,
                meal_time: value === null || value === void 0 ? void 0 : value.meal_time,
                recipes: [(_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.recipes],
            };
        });
        const prepData = Object.assign(Object.assign({ userId: req === null || req === void 0 ? void 0 : req.user._id }, (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.prepList), { recipes: [{ recipeId: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.recipes, isDone: false }], isDeleted: false });
        // meal plan oparation
        const createdMeal = yield Promise.all(mealPlanData.map((value) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const checkMealPlan = yield plan_model_1.default.findOne({
                userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id,
                date: value === null || value === void 0 ? void 0 : value.date,
                meal_time: value === null || value === void 0 ? void 0 : value.meal_time,
            }).lean();
            if (checkMealPlan) {
                const isRecipeExist = checkMealPlan.recipes.some((recipe) => { var _a; return (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.recipes.includes(recipe.toString()); });
                if (isRecipeExist) {
                    throw new Error('This recipe already exists in the meal plan');
                }
                const updatedMealPlan = yield plan_model_1.default.findOneAndUpdate({ _id: checkMealPlan._id }, { $push: { recipes: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.recipes } }, { new: true, session });
                return updatedMealPlan;
            }
            const creatingMealPlan = yield plan_model_1.default.create([value], { session });
            return creatingMealPlan[0];
        })));
        if (!createdMeal) {
            throw new Error('faild to created meal plan');
        }
        // prerp List opration
        const checkprepList = yield prep_model_1.default.findOne({ userId: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e._id, date: (_f = req === null || req === void 0 ? void 0 : req.body.prepList) === null || _f === void 0 ? void 0 : _f.date });
        if (checkprepList) {
            yield prep_model_1.default.findOneAndUpdate({ userId: (_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g._id, date: (_h = req === null || req === void 0 ? void 0 : req.body.prepList) === null || _h === void 0 ? void 0 : _h.date }, { $push: { recipes: { recipeId: (_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.recipes, isDone: false } } }, { new: true });
        }
        else {
            const createList = yield prep_model_1.default.create([prepData], { session });
            if (!createList) {
                throw new Error("Failed to create meal plan or prep list");
            }
        }
        yield session.commitTransaction();
        yield session.endSession();
        return createdMeal;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(`Error creating meal plan: ${error.message}`);
    }
});
exports.createMealPlanServices = createMealPlanServices;
