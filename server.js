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

// 🔒 Cipher Nichu Security Shield
const allowedOrigins = [
  "http://localhost:5173",
  "https://hayatix-ai.vercel.app",
  "https://hayatixai.nichu.dev",
  "https://solid-goldfish-5g4579j7w6qpcv96q-5001.app.github.dev",
  "http://localhost:5001"
];

const allowedUserAgents = [
  "Mozilla", "Chrome", "Safari", "Firefox", "Edg" // common browsers
];

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";
  const userAgent = req.headers["user-agent"] || "";

  // 1️⃣ Origin check
  if (!allowedOrigins.includes(origin)) {
    return deny(req, res, "Invalid origin");
  }

  // 2️⃣ Referer check (must start with one of your domains)
  const validReferer = allowedOrigins.some(allowed =>
    referer.startsWith(allowed)
  );
  if (!validReferer) {
    return deny(req, res, "Invalid referer");
  }

  // 3️⃣ User-Agent check (block curl, wget, Postman, bots)
  const validUA = allowedUserAgents.some(agent =>
    userAgent.includes(agent)
  );
  if (!validUA) {
    return deny(req, res, "Suspicious user agent");
  }

  // 4️⃣ Preflight OPTIONS request → handle cleanly
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }

  // ✅ Passed → allow
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// 🔥 Unified denial helper
function deny(req, res, reason) {
  return res.status(403).json({
    success: false,
    by: "Cipher Nichu",
    blocked: true,
    reason
  });
}


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
