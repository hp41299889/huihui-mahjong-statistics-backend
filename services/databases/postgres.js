"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresInit = exports.postgres = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../configs/config");
const entity = __importStar(require("../../entities"));
const postgres = new typeorm_1.DataSource({
    type: 'postgres',
    host: config_1.postgresConfig.host,
    port: +config_1.postgresConfig.port,
    username: config_1.postgresConfig.username,
    password: config_1.postgresConfig.password,
    database: config_1.postgresConfig.database,
    synchronize: true,
    entities: [
        entity.Player,
        entity.Record
    ]
});
exports.postgres = postgres;
const postgresInit = () => __awaiter(void 0, void 0, void 0, function* () {
    yield postgres.initialize()
        .then(() => {
        console.log('postgres connect success');
    })
        .catch((err) => {
        console.log(err);
        console.log('postgres connect fail');
    });
});
exports.postgresInit = postgresInit;
