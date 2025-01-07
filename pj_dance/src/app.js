const express = require("express");
const dotenv = require("dotenv");
const { dbConfig } = require("./db/dbConfig");
const authRouter = require("./routes/auth.routes");
const classRouter = require("./routes/classes.routes.js");
const paymentRoutes = require("./routes/paymentRoutes");
const purchaseRoutes = require("./routes/PurchaseRoutes");
const newsLetterRouter = require("./routes/newsLetter.routes");
const cors = require('cors')

const app = express()


// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend's URL and port
  methods: ['GET', 'POST'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies if needed
};

app.options('*', cors()); // Preflight request for all routes

app.use(cors(corsOptions))


dotenv.config();

const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json({ message: "welcome to the event management api" });
});
app.use("/auth", authRouter);
app.use("/", classRouter);
app.use("/api", paymentRoutes);
app.use("/api", purchaseRoutes);
app.use("/newsletters", newsLetterRouter);

// 404 page
app.use("*", (req, res) => {
  res.status(404).send("<h1>Page Not Found</h1>");
});

app.listen(PORT, () => {
  dbConfig();
  console.log(`Server running on port:${PORT}`);
});

module.exports = app;
