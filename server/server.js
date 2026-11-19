require("dotenv").config();

const cors = require("cors");
const express = require("express");
const movieRoutes = require("./routes/movieRoutes");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./routes/userRoutes");
const myListRoutes = require("./routes/myListRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const watchHistoryRoutes = require("./routes/watchHistoryRoutes");

const app = express();
// Percayai satu lapis reverse proxy saat berjalan di Vercel.
if (process.env.VERCEL === "1") {
  app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("Origin tidak diizinkan oleh CORS");
      error.statusCode = 403;

      return callback(error);
    },
  }),
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/my-list", myListRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/watch-history", watchHistoryRoutes);

app.get("/", (req, res) => {
  res.send("Chill Backend API is running!");
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET belum dikonfigurasi!");
}

// Jalankan HTTP listener hanya ketika
// server.js dijalankan langsung oleh Node.js.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Ekspor Express App untuk Vercel Functions.
module.exports = app;
