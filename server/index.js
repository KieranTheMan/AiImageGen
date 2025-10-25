import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import OpenAIApi from "openai";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./mongodb/connect.js";
import postRoute from "./routes/PostRoute.js";
import dalleRoute from "./routes/DalleRoute.js";

dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: '*',
  credentials: true,
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoute);
app.use("/api/v1/dalle", dalleRoute);


const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/health", async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    const healthStatus = {
      status: "OK",
      timestamp: new Date().toISOString(),
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
      database: {
        status: dbStatus
      }
    };

    // Return 200 if server is up - don't fail on external service issues
    // This allows the container to stay healthy even if external APIs have temporary issues
    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

app.get("/", async (req, res) => {
  res.send("Hello API");
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8000, () => {
      // eslint-disable-next-line no-console
      console.log("Server has started on port http://localhost:8000");
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Server startup error:", error);
  }
};

startServer();
