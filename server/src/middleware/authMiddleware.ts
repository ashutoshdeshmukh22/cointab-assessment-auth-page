import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

const userRepository = AppDataSource.getRepository(User);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {    
    const token = req.headers['authorization']?.split(' ')[1];
     
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'supersecretkey', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = await userRepository.findOne({ where: { id: (decoded as any).userId } });    
        (req as any).user = user;
        next();
    });
};
