"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepListRoute = void 0;
const express_1 = require("express");
const authentication_1 = require("../../middleware/authentication");
const prepListController_1 = require("./prepListController");
exports.prepListRoute = (0, express_1.Router)();
exports.prepListRoute.get('/get-prepList', authentication_1.authentication, prepListController_1.getPrepListController);
