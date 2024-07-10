import { Request, Response } from 'express';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';

export class AuthController {
    static async login(req: Request, res: Response) {
        console.log(req.body);
        
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            if (user.blockedUntil && user.blockedUntil > new Date()) {
                return res.status(403).json({ message: 'User is blocked. Try again later' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            // const isPasswordValid = password === user.password;
            if (!isPasswordValid) {
                user.loginAttempts += 1;
                if (user.loginAttempts >= 5) {
                    user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Block for 24 hours
                } 
                await userRepository.save(user);
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            user.loginAttempts = 0;
            user.blockedUntil = null;
            await userRepository.save(user);

            const token = jwt.sign({ userId: user.id }, 'supersecretkey', { expiresIn: '1h' });
            return res.json({ token });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async register(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        try {
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User();
            user.name = name;
            user.email = email;
            user.password = hashedPassword;
            await userRepository.save(user);
            return res.status(201).json({ message: 'User created successfully' }); 
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
