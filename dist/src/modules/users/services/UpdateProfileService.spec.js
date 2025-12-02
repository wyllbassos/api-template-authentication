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
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const UpdateProfileService_1 = __importDefault(require("./UpdateProfileService"));
let fakeUsersRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateProfileService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeHashProvider = new FakeHashProvider_1.default();
        updateProfile = new UpdateProfileService_1.default(fakeUsersRepository, fakeHashProvider);
    });
    it('should be able update the profile', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        const updatedUser = yield updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
        });
        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('johntre@example.com');
    }));
    it("should not be able update a non-existing user's profile", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(updateProfile.execute({
            user_id: 'non-existing-user-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
    it('should not be able to change to another user email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        const user = yield fakeUsersRepository.create({
            name: 'Test',
            email: 'teste@example.com',
            password: '12345',
        });
        yield expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
    it('should be able to update the password', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const updatedUser = yield updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123123',
            old_password: '123456',
        });
        expect(updatedUser.password).toBe('123123');
    }));
    it('should not be able to update the password with out old password', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        yield expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
    it('should not be able to update the password with wrong old password', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        yield expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            old_password: 'wrong-old-password',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
});
