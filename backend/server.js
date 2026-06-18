const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const dns = require("dns");

require("dotenv").config({ quiet: true });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

/* Routes */

const authRoutes =
require("./routes/authRoutes");

const admissionRoutes =
require("./routes/admissionRoutes");

const app = express();

/* Middleware */

app.use(cors());

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

  app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

  });

})

.catch((err) => {

  console.error("MongoDB connection failed:", err.message);
  process.exit(1);

});
