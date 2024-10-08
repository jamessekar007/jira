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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const crypto_1 = require("crypto");
const dotenv = __importStar(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv.config();
class UserController {
    constructor() {
        // Your methods here
        // Define the function to create a new user
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Create Users');
            const { name, email, password } = req.body;
            if (!email) {
                res.status(400).json({ message: 'Email is required' });
            }
            const users = yield prisma.user.findMany({
                where: {
                    email: email,
                },
            });
            if (users.length > 0) {
                res.status(400).json({ message: 'Email already Exist' });
            }
            else {
                const salt = process.env.SALT || 'XYZABCD98765!@#$%EFGH1234IJKL%$#@!';
                const hash = (0, crypto_1.createHash)('sha512')
                    .update(salt + password) // Combine salt with the data
                    .digest('hex');
                const user = yield prisma.user.create({
                    data: {
                        name: name,
                        userTypeId: 2,
                        email: email,
                        password: hash
                    },
                });
                res.status(201).json({ message: 'User created successfully', data: user });
            }
        });
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Login Users');
            const { email, password } = req.body;
            const salt = process.env.SALT || 'XYZABCD98765!@#$%EFGH1234IJKL%$#@!';
            const hash = (0, crypto_1.createHash)('sha512')
                .update(salt + password) // Combine salt with the data
                .digest('hex');
            const users = yield prisma.user.findMany({
                where: {
                    AND: [
                        { email: email },
                        { password: hash }, // name contains 'John'
                    ],
                },
            });
            const jwt_secret_key = process.env.JWT_SECRET_KEY || "EFGH1234IJKL%$#@!XYZABCD98765!@#$%";
            const accessToken = jsonwebtoken_1.default.sign({ users }, jwt_secret_key, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ users }, jwt_secret_key, { expiresIn: '10d' });
            let response = {
                name: users[0].name,
                email: users[0].email,
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            res.status(200).json({ message: 'User Logged In successfully', data: response });
        });
        this.profile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ message: 'User Logged In successfully' });
        });
    }
    getUsers(req, res, next) {
        console.log('Get Users');
    }
}
exports.default = UserController;
