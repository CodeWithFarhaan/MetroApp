import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

// Use cookie-parser middleware to parse cookies
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend's URL
    credentials: true, // Allow cookies to be sent/received
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
connectDb();

app.get("/", (req, res) => {
  res.send("this is a test");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port no : ${PORT}`);
});
