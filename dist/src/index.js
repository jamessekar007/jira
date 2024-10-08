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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
////"dev": "ts-node src/index.ts"
//npx prisma migrate dev --name add-order-model
// npm run migrate
//npx tsc prisma/seed.ts
//node prisma/seed.js
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const Router = express_1.default.Router();
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
app.get('/', (req, res) => {
    res.json({ message: 'Hello from API v1!' });
});
app.get('/userType', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userType = yield prisma.userType.findMany();
    res.json({ data: userType });
}));
app.use('/api/v1', Router);
app.use('/users', userRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
