import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoute.js';
import footballerRoutes from './routes/footballerRoute.js';
import ratingRoutes from './routes/ratingRoute.js';
import userRoutes from './routes/userRoute.js';
import leaderboardRoutes from './routes/leaderboardRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/footballers', footballerRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ message: 'An unexpected error occurred.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));