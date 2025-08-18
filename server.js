const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');   // <--- add this
const connectDB = require('./config/db');

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

// Enable CORS (default: allows all origins)
app.use(cors());

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
