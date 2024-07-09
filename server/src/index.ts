import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';  
import cors from 'cors';

AppDataSource.initialize().then(async () => {
    const app = express();

    app.use(cors());

    app.use(bodyParser.json());

    app.use('/api/auth', authRoutes);    

    app.get('/api/home', authMiddleware, (req, res) => {
        res.json({ email: 'user@example.com' }); // Replace with actual user email
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);   
    });
}).catch(error => {
    console.error('Error during Data Source initialization:', error);
});
    