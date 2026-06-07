require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoute = require('./routes/auth');
const tokenRoute = require('./routes/token');  
const workoutsRoute = require('./routes/workouts');
const exerciseRoute = require('./routes/exercises');
const musclesRoute = require('./routes/muscles');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://anastasiat18.github.io/tum-web-lab6/'],
  credentials: true  // ← allows cookies to be sent cross-origin
}));

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoute);
app.use('/api', tokenRoute);
app.use('/api/workouts', workoutsRoute);
app.use('/api/exercises', exerciseRoute);
app.use('/api/muscles', musclesRoute);


app.get('/', (req, res) => {
  res.json({ message: 'GainMap API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/docs`);
});