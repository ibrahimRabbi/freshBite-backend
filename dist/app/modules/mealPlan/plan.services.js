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
const plan_model_1 = __importDefault(require("./plan.model"));
const prep_model_1 = __importDefault(require("../prepList/prep.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createMealPlanServices = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const mealPlanData = {
            userId: req === null || req === void 0 ? void 0 : req.user._id,
            meals: ((_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.meals) === null || _b === void 0 ? void 0 : _b.map((value) => {
                var _a;
                return Object.assign(Object.assign({}, value), { recipes: [(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.recipes], comments: [] });
            })) || [],
            isDeleted: false
        };
        const prepData = Object.assign(Object.assign({ userId: req === null || req === void 0 ? void 0 : req.user._id }, (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.prepList), { recipes: [{ recipeId: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.recipes, isDone: false }], isDeleted: false });
        const creatingMealPlan = yield plan_model_1.default.create([mealPlanData], { session });
        const createPrepList = yield prep_model_1.default.create([prepData], { session });
        if (!creatingMealPlan || !createPrepList) {
            throw new Error("Failed to create meal plan or prep list");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return creatingMealPlan;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(`Error creating meal plan: ${error.message}`);
    }
});
exports.createMealPlanServices = createMealPlanServices;
