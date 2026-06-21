import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import activitiesRoutes from './routes/activities.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activitiesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Verdant API server running on http://localhost:${PORT}`);
});