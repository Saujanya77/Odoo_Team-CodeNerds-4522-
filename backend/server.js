import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './db/connectDb.js';
import router from './routes/userRoutes.js';
import routerswap from "./routes/swapRoutes.js"
// import swapRoutes from './routes/swapRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
// Connect to MongoDB
connectDb();


// Create Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      origin: ['https://skillswap-backend-mt2t.onrender.com/', 'http://localhost:8080'],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

// Routes
app.use('/api/user', router);
app.use('/api/swap', routerswap);

app.get('/', (req, res) => {
  res.send('Skill Swap API Running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});