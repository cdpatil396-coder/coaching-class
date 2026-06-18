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

const User =
require("./models/User");

const app = express();

const ADMIN_EMAIL =
process.env.ADMIN_EMAIL || "cdpatil396@gmail.com";

const ADMIN_PASSWORD =
process.env.ADMIN_PASSWORD || "Waghod@123";

const ADMIN_NAME =
process.env.ADMIN_NAME || "Chetan Patil";

const ensureAdminUser =
async () => {

  const admin =
  await User.findOne({
    email: ADMIN_EMAIL
  });

  const hashedPassword =
  await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (!admin) {

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin user created");

    return;

  }

  admin.name = ADMIN_NAME;
  admin.password = hashedPassword;
  admin.role = "admin";

  await admin.save();

  console.log("Admin user ready");

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

/* API Routes */

app.use("/api/auth", authRoutes);

app.use("/api/admissions", admissionRoutes);

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

  return ensureAdminUser();

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
