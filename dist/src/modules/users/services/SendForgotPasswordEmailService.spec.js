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
const FakeMailProvider_1 = __importDefault(require("@shared/container/providers/MailProvider/fakes/FakeMailProvider"));
const AppError_1 = __importDefault(require("@shared/errors/AppError"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const FakeUserTokenRepository_1 = __importDefault(require("../repositories/fakes/FakeUserTokenRepository"));
const SendForgotPasswordEmailService_1 = __importDefault(require("./SendForgotPasswordEmailService"));
let fakeUsersRepository;
let fakeMailProvider;
let fakeUsersTokenRepository;
let sendForgotPasswordEmail;
describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeMailProvider = new FakeMailProvider_1.default();
        fakeUsersTokenRepository = new FakeUserTokenRepository_1.default();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService_1.default(fakeUsersRepository, fakeMailProvider, fakeUsersTokenRepository);
    });
    it('should be able to recover the password using the email', () => __awaiter(void 0, void 0, void 0, function* () {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
        yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        yield sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });
        expect(sendMail).toHaveBeenCalled();
    }));
    it('should not be able to recover a non-existing user password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError_1.default);
    }));
    it('should generate a forgot password token', () => __awaiter(void 0, void 0, void 0, function* () {
        const generateToken = jest.spyOn(fakeUsersTokenRepository, 'generate');
        const user = yield fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '12345',
        });
        yield sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });
        expect(generateToken).toHaveBeenCalledWith(user.id);
    }));
});
