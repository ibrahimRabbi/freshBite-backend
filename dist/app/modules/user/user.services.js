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
exports.signUpOtpServices = exports.createUserServices = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpGenarator_1 = require("../../helper/otpGenarator");
const emailTemplete_1 = require("../../helper/emailTemplete");
const user_model_1 = __importDefault(require("./user.model"));
// const data: Tuser = {
//         ...payload,
//         age : calculateAge(payload?.birthDay),
//         role: 'user',
//     }
//     data.address = {
//         type: 'Point',
//         coordinates: payload.address?.coordinates.reverse()
//     }
// const creating = await userModel.create(payload)
// if (!creating) {
//     throw new Error('faild to create user')
// }
const createUserServices = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const otpCode = (0, otpGenarator_1.generateOtpCode)();
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: config_1.envData.email,
            pass: config_1.envData.emailPassword
        }
    });
    const send = yield transporter.sendMail({
        from: {
            name: 'Rumblle',
            address: config_1.envData.email
        },
        to: payload.email,
        subject: 'Rumble email verification code--Sign Up',
        text: '',
        html: (0, emailTemplete_1.templeteString)(payload.email, otpCode)
    });
    if (!send.response) {
        throw new Error('faild to send email');
    }
    const credentials = Object.assign(Object.assign({}, payload), { otpCode: otpCode });
    const verificationToken = jsonwebtoken_1.default.sign(credentials, config_1.envData.secretKey, { expiresIn: '3m' });
    return verificationToken;
});
exports.createUserServices = createUserServices;
const signUpOtpServices = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Unauthorized: No token provided");
        }
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token) {
            throw new Error("Unauthorized: No token provided");
        }
        const decodeUser = jsonwebtoken_1.default.verify(token, config_1.envData.secretKey);
        if (!decodeUser) {
            throw new Error('unauthorized user');
        }
        if ((decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.otpCode) !== ((_c = req.body) === null || _c === void 0 ? void 0 : _c.otpCode)) {
            throw new Error('invalid otp');
        }
        const data = {
            email: decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.email,
            password: decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.password,
            name: decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.name,
            phoneNumber: decodeUser === null || decodeUser === void 0 ? void 0 : decodeUser.phoneNumber,
            isEmailVerified: true,
            role: 'user',
        };
        const creating = yield user_model_1.default.create(data);
        if (!creating) {
            throw new Error('faild to create user');
        }
        return creating;
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error("otp code expierd");
        }
        throw new Error(err);
    }
});
exports.signUpOtpServices = signUpOtpServices;
