import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js"
import experienceRoutes from "./routes/experiences.js"
import bookingRoutes from "./routes/bookings.js"
import promoRoutes from "./routes/promo.js"

dotenv.config()

const app = express()

// Middleware
// app.use(cors())

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN || "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/experiences", experienceRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/promo", promoRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
