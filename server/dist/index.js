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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const data_source_1 = require("./data-source");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use('/api/auth', authRoutes_1.default);
    app.get('/api/home', authMiddleware_1.authMiddleware, (req, res) => {
        res.json({ email: 'user@example.com' }); // Replace with actual user email
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})).catch(error => console.log(error));
