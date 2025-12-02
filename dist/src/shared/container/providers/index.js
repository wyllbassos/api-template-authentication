"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const DiskStorageProvider_1 = __importDefault(require("./StorageProvider/implementations/DiskStorageProvider"));
const EtherealMailProvider_1 = __importDefault(require("./MailProvider/implementations/EtherealMailProvider"));
const HandlebarsMailTemplateProvider_1 = __importDefault(require("./MailTemplateProvieder/implementations/HandlebarsMailTemplateProvider"));
tsyringe_1.container.registerSingleton('StorageProvider', DiskStorageProvider_1.default);
tsyringe_1.container.registerSingleton('MailTemplateProvider', HandlebarsMailTemplateProvider_1.default);
tsyringe_1.container.registerInstance('MailProvider', tsyringe_1.container.resolve(EtherealMailProvider_1.default));
