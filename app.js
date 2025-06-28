import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './services/dbConnectionService';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect to database
connectToDatabase();

// Routes
const usersRoutes = require('./routes/usersRoutes');
const eventsRoutes = require('./routes/eventsRoutes');

const PORT = process.env.PORT || 3000;

app.use('/v1/events', eventsRoutes);
app.use('/v1/users', usersRoutes);


app.listen(PORT, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${PORT}`);
});

module.exports = app;
