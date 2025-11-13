"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
exports.authRoute = (0, express_1.Router)();
exports.authRoute.post('/sign-in', auth_controller_1.signInController);
exports.authRoute.post('/forget-password', auth_controller_1.forgetPasswordController);
exports.authRoute.post('/verify-otp', auth_controller_1.verifyOtpController);
