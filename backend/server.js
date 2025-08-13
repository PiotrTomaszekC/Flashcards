// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import express from "express";
// import connectDB from "./config/db.js";
// import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
// import flashcardsRoutes from "./routes/flashcardRoutes.js";
// import setRoutes from "./routes/setRoutes.js";
// import studyStatsRoutes from "./routes/studyStatsRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// dotenv.config();

// const port = process.env.PORT || 5000;

// // connectDB();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// app.use("/api/flashcards", flashcardsRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/sets", setRoutes);
// app.use("/api/studyStats", studyStatsRoutes);

// app.use(notFound);
// app.use(errorHandler);

// if (process.env.NODE_ENV !== "test") {
//   connectDB();
//   app.listen(port, () => console.log(`Server is running on port ${port}`));
// }

// export default app;

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import flashcardsRoutes from "./routes/flashcardRoutes.js";
import setRoutes from "./routes/setRoutes.js";
import studyStatsRoutes from "./routes/studyStatsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/flashcards", flashcardsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sets", setRoutes);
app.use("/api/studyStats", studyStatsRoutes);

// Required for __dirname in ES modules
const __dirname = path.resolve();

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== "test") {
  connectDB();
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default app;
