"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileController_1 = __importDefault(require("../controllers/ProfileController"));
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const profileController = new ProfileController_1.default();
const profileRouter = express_1.Router();
profileRouter.use(ensureAuthenticated_1.default);
profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);
exports.default = profileRouter;
