const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const dns = require("dns");

const bcrypt = require("bcryptjs");

require("dotenv").config({ quiet: true });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

/* Routes */

const authRoutes =
require("./routes/authRoutes");

const admissionRoutes =
require("./routes/admissionRoutes");

const educationRoutes =
require("./routes/educationRoutes");

const User =
require("./models/User");

const app = express();
app.disable("x-powered-by");

const ADMIN_EMAIL =
process.env.ADMIN_EMAIL || "cdpatil396@gmail.com";

const ADMIN_PASSWORD =
process.env.ADMIN_PASSWORD || "Waghod@123";

const ADMIN_NAME =
process.env.ADMIN_NAME || "Chetan Patil";

const EXTRA_ADMIN_EMAIL = "swamicoaching396@gmail.com";
const EXTRA_ADMIN_PASSWORD = "Swamicoaching396@123";
const EXTRA_ADMIN_NAME = "Swami Coaching Admin";

const ADMIN_ACCOUNTS = [
  {
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  },
  {
    name: EXTRA_ADMIN_NAME,
    email: EXTRA_ADMIN_EMAIL,
    password: EXTRA_ADMIN_PASSWORD
  }
];

const ensureAdminUsers =
async () => {

  for (const account of ADMIN_ACCOUNTS) {

    const hashedPassword =
    await bcrypt.hash(account.password, 10);

    const admin =
    await User.findOne({
      email: account.email
    });

    if (!admin) {

      await User.create({
        name: account.name,
        email: account.email,
        password: hashedPassword,
        role: "admin"
      });

      continue;

    }

    admin.name = account.name;
    admin.password = hashedPassword;
    admin.role = "admin";

    await admin.save();

  }

  console.log("Admin users ready");

};

const normalizeUserIndexes =
async () => {

  await User.updateMany(
    {
      $or: [
        {
          email: null
        },
        {
          email: ""
        }
      ]
    },
    {
      $unset: {
        email: ""
      }
    }
  );

  await User.updateMany(
    {
      $or: [
        {
          phone: null
        },
        {
          phone: ""
        }
      ]
    },
    {
      $unset: {
        phone: ""
      }
    }
  );

  await User.syncIndexes();

  console.log("User indexes normalized");

};

const createRateLimiter = ({
  windowMs,
  max
}) => {

  const hits = new Map();

  return (req, res, next) => {

    const key = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const now = Date.now();
    const entry = hits.get(key) || {
      count: 0,
      resetAt: now + windowMs
    };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > max) {
      return res.status(429).json({
        message: "Too many requests. Please try again later."
      });
    }

    next();

  };

};

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://coaching-class.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

/* Middleware */

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

const authLimiter =
createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25
});

const admissionLimiter =
createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60
});

const educationLimiter =
createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60
});

/* API Routes */

app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/admissions", admissionLimiter, admissionRoutes);

app.use("/api/education", educationLimiter, educationRoutes);

/* Test Route */

app.get("/", (req, res) => {

  res.send("API Running");

});

/* Server */

const PORT = process.env.PORT || 5000;

/* MongoDB Connection */

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

console.log("Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})

.then(() => {

  console.log("MongoDB Connected");

  return ensureAdminUsers();

})

.then(() => {

  return normalizeUserIndexes();

})

.then(() => {

  app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

  });

})

.catch((err) => {

  console.error("MongoDB connection failed:", err.message);
  process.exit(1);

});
