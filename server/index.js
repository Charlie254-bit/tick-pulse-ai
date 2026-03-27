import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic API to satisfy backend requirement
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Any trading history or user settings could be stored here in a real app
app.get('/api/signals/config', (req, res) => {
  res.json({
    thresholds: {
      strong: 25,
      moderate: 15
    },
    default_stake: 1.0,
    assets: ['R_100', 'R_10', 'R_25', 'R_50']
  });
});

app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
});