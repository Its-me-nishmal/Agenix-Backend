const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');   // <--- add this
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const agents = require('./routes/agents');
const sessions = require('./routes/sessions');
const admin = require('./routes/admin');

const app = express();

// Body parser
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://hayatix-ai.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Blocked: Not allowed by Cipher Nichu rules"));
      }
    },
    credentials: true,
  })
);

// 20 per minute
const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// 200 per hour
const perHourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

// 2000 per day
const perDayLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
});


app.use(perMinuteLimiter, perHourLimiter, perDayLimiter); // apply to all requests


// If you want to restrict origins, you can configure like this:
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://yourdomain.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// Mount routers
app.use('/agents', agents);
app.use('/sessions', sessions);
app.use('/admin', admin);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
