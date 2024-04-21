import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import authRoute from './routes/authRoutes.js'
import userRoute from './routes/userRoutes.js'
import path from 'path';
dotenv.config();

const app = express();


mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Error connecting to MongoDB' + err.message);
});
const __dirname = path.resolve();
app.use(express.json());
app.use(cors({credentials:true}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


app.use((err, req, res, next) => {
    const statuscode = err.statusCode || 500;
    const message = err.message || 'Server error';
    res.status(statuscode).json({
        success: false,
        statuscode,
        message
    });
});

