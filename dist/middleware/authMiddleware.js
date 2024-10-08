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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminAuth = exports.checkUserAuth = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dotenv = __importStar(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv.config();
const checkUserAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Check if header is present and starts with 'Bearer'
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // Get the token part
        // Replace 'your-secret-key' with your actual secret
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            // Store the decoded payload in the request object
            req.user = decoded;
            if (req.user.users[0].userTypeId == 2) {
                next(); // Proceed to the next middleware or route handler
            }
            else {
                return res.status(403).json({ message: 'Access Denied' });
            }
        });
    }
    else {
        res.status(401).json({ message: 'Authorization token missing or malformed' });
    }
};
exports.checkUserAuth = checkUserAuth;
const checkAdminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Check if header is present and starts with 'Bearer'
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // Get the token part
        // Replace 'your-secret-key' with your actual secret
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            // Store the decoded payload in the request object
            req.user = decoded;
            if (req.user.users[0].userTypeId == 1) {
                next(); // Proceed to the next middleware or route handler
            }
            else {
                return res.status(403).json({ message: 'Access Denied' });
            }
        });
    }
    else {
        res.status(401).json({ message: 'Authorization token missing or malformed' });
    }
};
exports.checkAdminAuth = checkAdminAuth;
