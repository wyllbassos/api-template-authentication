"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const tsyringe_1 = require("tsyringe");
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
let UpdateProfileServices = class UpdateProfileServices {
    constructor(usersRepository, hashProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, name, email, password, old_password } = data;
            const user = yield this.usersRepository.findById(user_id);
            if (!user) {
                throw new AppError_1.default('User not found');
            }
            const userWithUpdateEmail = yield this.usersRepository.findByEmail(email);
            if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
                throw new AppError_1.default('E-mail already in use.');
            }
            user.name = name;
            user.email = email;
            if (password && !old_password) {
                throw new AppError_1.default('You need to inform to set a new password');
            }
            if (password && old_password) {
                const checkOldPassword = yield this.hashProvider.compareHash(old_password, user.password);
                if (!checkOldPassword) {
                    throw new AppError_1.default('Old password does not match.');
                }
                user.password = yield this.hashProvider.gererateHash(password);
            }
            return this.usersRepository.save(user);
        });
    }
};
UpdateProfileServices = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('HashProvider')),
    __metadata("design:paramtypes", [Object, Object])
], UpdateProfileServices);
exports.default = UpdateProfileServices;
