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
exports.updateUserServices = exports.createUserServices = void 0;
const config_1 = require("../../config/config");
const slugGenerator_1 = require("../../helper/slugGenerator");
const user_model_1 = __importDefault(require("./user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserServices = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const data = Object.assign(Object.assign({}, payload), { slug_id: (0, slugGenerator_1.generateSlugId)(), role: 'user', planType: 'guest' });
    const creating = yield user_model_1.default.create(data);
    if (!creating) {
        throw new Error('faild to create user');
    }
    const credentials = {
        name: creating.fullName,
        email: creating.email,
        slug_id: creating.slug_id,
        role: creating.role,
        planType: creating.planType
    };
    const accessToken = jsonwebtoken_1.default.sign(credentials, config_1.envData.secretKey, { expiresIn: '12d' });
    return accessToken;
});
exports.createUserServices = createUserServices;
const updateUserServices = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const updating = yield user_model_1.default.findOneAndUpdate({ email: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email }, req.body, { new: true, runValidators: true, context: 'query' });
    if (!updating) {
        throw new Error('faild to create user');
    }
    const credentials = {
        name: updating.fullName,
        email: updating.email,
        role: updating.role,
        planType: updating.planType
    };
    const accessToken = jsonwebtoken_1.default.sign(credentials, config_1.envData.secretKey, { expiresIn: '12d' });
    return accessToken;
});
exports.updateUserServices = updateUserServices;
