import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import flashcardsRoutes from "./routes/flashcardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import setRoutes from "./routes/setRoutes.js";
import studyStatsRoutes from "./routes/studyStatsRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000;

connectDB(); //Connect to MongoDB

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/flashcards", flashcardsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sets", setRoutes);
app.use("/api/studyStats", studyStatsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
