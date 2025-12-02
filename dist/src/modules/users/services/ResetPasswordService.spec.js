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
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const FakeUserTokenRepository_1 = __importDefault(require("../repositories/fakes/FakeUserTokenRepository"));
const ResetPasswordService_1 = __importDefault(require("./ResetPasswordService"));
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
let fakeUsersRepository;
let fakeUsersTokenRepository;
let resetPassword;
let fakeHashProvider;
describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeUsersTokenRepository = new FakeUserTokenRepository_1.default();
        fakeHashProvider = new FakeHashProvider_1.default();
        resetPassword = new ResetPasswordService_1.default(fakeUsersRepository, fakeUsersTokenRepository, fakeHashProvider);
    });
    it('should be able to reset a password', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        const { token } = yield fakeUsersTokenRepository.generate(user.id);
        const generateHash = jest.spyOn(fakeHashProvider, 'gererateHash');
        yield resetPassword.execute({
            password: '123123',
            token,
        });
        const updatedUser = yield fakeUsersRepository.findById(user.id);
        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('123123');
    }));
    it('should not be able to reset a password with non-existen token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(resetPassword.execute({
            password: '123456',
            token: 'non-existing-token',
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
    it('should not be able to reset a password with non-existen user', () => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = yield fakeUsersTokenRepository.generate('non-existing-user');
        yield expect(resetPassword.execute({
            password: '123456',
            token,
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
    it('should not be able to reset a password if passed more than 2 hours', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        const { token } = yield fakeUsersTokenRepository.generate(user.id);
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });
        yield expect(resetPassword.execute({
            password: '123123',
            token,
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
});
