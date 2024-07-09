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
exports.AuthController = void 0;
const User_1 = require("../entity/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            try {
                const user = yield userRepository.findOne({ where: { email } });
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                if (user.blockedUntil && user.blockedUntil > new Date()) {
                    return res.status(403).json({ message: 'User is blocked. Try again later' });
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    user.loginAttempts += 1;
                    if (user.loginAttempts >= 5) {
                        user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Block for 24 hours
                    }
                    yield userRepository.save(user);
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                user.loginAttempts = 0;
                user.blockedUntil = null;
                yield userRepository.save(user);
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                return res.json({ token });
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.AuthController = AuthController;
