const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

dotenv.config();
connectDB();

const agents = require('./routes/agents');
const sessions = require('./routes/sessions');
const admin = require('./routes/admin');

const app = express();

// Body parser
app.use(express.json());

// ✅ Cipher Nichu strict allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://hayatix-ai.vercel.app"
];

// 🔥 Custom CORS/Origin middleware (manual)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // ✅ handle preflight cleanly
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    return next();
  }

  // ❌ Block curl / postman / unknown domains
  res.status(403).json({
    success: false,
    by: "Cipher Nichu",
    message: "Blocked: Unauthorized domain or curl request"
  });
});

// ✅ Rate limiters
const perMinuteLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
const perHourLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 200 });
const perDayLimiter = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 2000 });

app.use(perMinuteLimiter, perHourLimiter, perDayLimiter);

// ✅ Routes
app.use('/agents', agents);
app.use('/sessions', sessions);
app.use('/admin', admin);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
