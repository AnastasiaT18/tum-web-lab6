require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const tokenRoute = require('./routes/token');  
const workoutsRoute = require('./routes/workouts');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', tokenRoute);
app.use('/api/workouts', workoutsRoute);


app.get('/', (req, res) => {
  res.json({ message: 'GainMap API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});