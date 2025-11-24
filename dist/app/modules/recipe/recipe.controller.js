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
exports.addNoteontroller = exports.addReviewController = exports.deleteRecipeController = exports.updateRecipeController = exports.getAllRecipeController = exports.getSingleRecipeController = exports.videoUploadController = exports.createrecipeController = void 0;
const catchAsync_1 = require("../../helper/catchAsync");
const recipe_model_1 = require("./recipe.model");
const http_status_1 = __importDefault(require("http-status"));
const imageUploader_1 = require("../../helper/imageUploader");
const videoUpload_1 = require("../../helper/videoUpload");
exports.createrecipeController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            throw new Error('Unauthorized Access');
        }
        const checkBefore = yield recipe_model_1.recipeModel.findOne({ title: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.title });
        if (checkBefore) {
            throw new Error('this recipe already exist');
        }
        const imageNamePrefix = `${(_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.title}_${Math.random().toString().split('.')[1]}`;
        const RecipeImagefiles = Array.isArray(req === null || req === void 0 ? void 0 : req.files) ? req.files : (_d = req === null || req === void 0 ? void 0 : req.files) === null || _d === void 0 ? void 0 : _d.recipeimages;
        const recipeimageUrls = yield Promise.all(RecipeImagefiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, imageUploader_1.uploadImage)(file === null || file === void 0 ? void 0 : file.path, `${imageNamePrefix}`);
            return result.secure_url;
        })));
        req.body = Object.assign(Object.assign({}, (req.body || {})), { recipeImages: recipeimageUrls });
        const creating = yield recipe_model_1.recipeModel.create(req === null || req === void 0 ? void 0 : req.body);
        if (!creating) {
            throw new Error('faild to create recipe');
        }
        res.status(http_status_1.default.OK).json({
            success: true,
            status: http_status_1.default.OK,
            message: 'recipe created successfully',
            data: creating
        });
    }
    catch (err) {
        throw new Error(err === null || err === void 0 ? void 0 : err.message);
    }
}));
exports.videoUploadController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const imageNamePrefix = (Math.random() * 90000).toString().split('.')[1];
    if ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) {
        const result = yield (0, videoUpload_1.uploadVideo)((_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.path, `${imageNamePrefix}`);
        console.log(result);
        res.status(http_status_1.default.OK).json({
            success: true,
            status: http_status_1.default.OK,
            message: 'recipe created successfully',
            url: result === null || result === void 0 ? void 0 : result.secure_url
        });
    }
    else {
        throw new Error('invalid file path');
    }
}));
exports.getSingleRecipeController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const finding = yield recipe_model_1.recipeModel.findById((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!finding) {
        throw new Error('faild to get recipe');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'recipe retrived successfully',
        data: finding
    });
}));
exports.getAllRecipeController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const finding = yield recipe_model_1.recipeModel.find({ isDeleted: { $ne: true } });
    if (!finding) {
        throw new Error('faild to get recipe');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'recipe retrived successfully',
        data: finding
    });
}));
exports.updateRecipeController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        throw new Error('Unauthorized Access');
    }
    const updating = yield recipe_model_1.recipeModel.findByIdAndUpdate((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id, req.body, { new: true, runValidators: true, context: 'query' });
    if (!updating) {
        throw new Error('faild to create user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'recipe updated successfully',
        data: updating
    });
}));
exports.deleteRecipeController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        throw new Error('Unauthorized Access');
    }
    const updating = yield recipe_model_1.recipeModel.findByIdAndUpdate((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id, { isDeleted: true }, { new: true, runValidators: true, context: 'query' });
    if (!updating) {
        throw new Error('faild to create user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'recipe updated successfully',
        data: updating
    });
}));
exports.addReviewController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updating = yield recipe_model_1.recipeModel.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id, { $push: { reviews: Object.assign({ userId: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id }, req.body) } }, { new: true, runValidators: true, context: 'query' });
    if (!updating) {
        throw new Error('faild to create user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'recipe updated successfully',
        data: updating
    });
}));
exports.addNoteontroller = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updating = yield recipe_model_1.recipeModel.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id, { $push: { notes: Object.assign({ userId: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id }, req.body) } }, { new: true, runValidators: true, context: 'query' });
    if (!updating) {
        throw new Error('faild to create user');
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        status: http_status_1.default.OK,
        message: 'recipe updated successfully',
        data: updating
    });
}));
