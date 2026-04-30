const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('Jobin OpsCenter API is active. Use /api routes for data.'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/revenue', require('./routes/revenue'));

const PORT = process.env.PORT || 5000;

// Simple heartbeat to keep process alive if needed
setInterval(() => {}, 1000000);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
