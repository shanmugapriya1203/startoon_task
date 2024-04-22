import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/authRoutes.js';
import userRoute from './routes/userRoutes.js';

dotenv.config();
const __dirname = path.resolve();
const app = express();

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB' + err.message);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

// API routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

// Static files serving
app.use(express.static(path.join(__dirname, "/client/build")));

// Serve React client
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
