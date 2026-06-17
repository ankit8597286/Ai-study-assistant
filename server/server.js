const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
const authRoutes = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const flashcardRoutes =require( "./routes/flashcardRoutes");

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000").split(",");

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/planner", plannerRoutes);
app.use(
  "/api/flashcards",
  flashcardRoutes
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  );
});