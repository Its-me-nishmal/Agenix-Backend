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
  "https://hayatixai.nichu.dev"
];

const allowedUserAgents = [
  "Mozilla", "Chrome", "Safari", "Firefox", "Edg" // common browsers
];

// 🚨 Advanced Anti-Spoof Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";
  const ua = req.headers["user-agent"] || "";
  const fetchSite = req.headers["sec-fetch-site"] || "";
  const fetchMode = req.headers["sec-fetch-mode"] || "";
  const fetchDest = req.headers["sec-fetch-dest"] || "";
  const chUa = req.headers["sec-ch-ua"] || "";
  const chPlatform = req.headers["sec-ch-ua-platform"] || "";

  // 1️⃣ Origin & Referer strict
  if (!allowedOrigins.includes(origin)) return deny(res, "Bad origin");
  if (!allowedOrigins.some(o => referer.startsWith(o))) return deny(res, "Bad referer");

  // 2️⃣ User-Agent sanity check
  if (!ua.includes("Mozilla") || ua.length < 20) return deny(res, "Suspicious UA");

  // 3️⃣ Sec-Fetch-* headers (curl/postman rarely match these perfectly)
  if (!(fetchMode === "cors" && fetchDest === "empty")) return deny(res, "Bad fetch headers");
  if (!["same-origin", "cross-site"].includes(fetchSite)) return deny(res, "Bad fetch site");

  // 4️⃣ Client Hints (sec-ch-ua must look like Chrome/Firefox/etc.)
  if (!chUa.includes("Chrome") && !chUa.includes("Firefox")) return deny(res, "Invalid client hint");
  if (!chPlatform) return deny(res, "Missing platform hint");

  // ✅ Preflight OPTIONS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

function deny(res, reason) {
  return res.status(403).json({
    success: false,
    by: "Cipher Nichu",
    reason
  });
}


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
