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
const UpdateProfileService_1 = __importDefault(require("@modules/users/services/UpdateProfileService"));
const ShowProfileService_1 = __importDefault(require("@modules/users/services/ShowProfileService"));
const tsyringe_1 = require("tsyringe");
// Regra de CRUD em REST
// index, show, create, update, delete
class ProfileController {
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = request.user.id;
            const showProfile = tsyringe_1.container.resolve(ShowProfileService_1.default);
            const user = yield showProfile.execute({ user_id });
            return response.json(Object.assign(Object.assign({}, user), { password: undefined }));
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = request.user.id;
            const { name, email, old_password, password } = request.body;
            const updateProfile = tsyringe_1.container.resolve(UpdateProfileService_1.default);
            const user = yield updateProfile.execute({
                user_id,
                name,
                email,
                old_password,
                password,
            });
            return response.send(Object.assign(Object.assign({}, user), { password: undefined }));
        });
    }
}
exports.default = ProfileController;
