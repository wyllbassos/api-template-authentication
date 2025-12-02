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
const FakeStorageProvider_1 = __importDefault(require("@shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const UpdateUserAvatarService_1 = __importDefault(require("./UpdateUserAvatarService"));
let fakeStorageProvider;
let fakeUsersRepository;
let updateUserAvatar;
describe('UpdateUserAvatarService', () => {
    beforeEach(() => {
        fakeStorageProvider = new FakeStorageProvider_1.default();
        fakeUsersRepository = new FakeUsersRepository_1.default();
        updateUserAvatar = new UpdateUserAvatarService_1.default(fakeUsersRepository, fakeStorageProvider);
    });
    it('should be able to update an avatar from a user', () => __awaiter(void 0, void 0, void 0, function* () {
        1;
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        yield updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });
        expect(user.avatar).toBe('avatar.jpg');
    }));
    it('should be able to update avatar from non existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg',
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
    it('should delete old avatar when updating new one', () => __awaiter(void 0, void 0, void 0, function* () {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        yield updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });
        yield updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    }));
});
