const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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

// ✅ Strict CORS config
const allowedOrigins = [
  "http://localhost:5173",
  "https://hayatix-ai.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS Blocked: Origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS before anything else
app.use(cors(corsOptions));

// ✅ Explicit preflight handling
app.options("*", cors(corsOptions));

// ✅ Rate limiters (after CORS so preflights aren’t blocked)
const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const perHourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const perDayLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(perMinuteLimiter, perHourLimiter, perDayLimiter);

// ✅ Mount routers
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
