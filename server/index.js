import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import OpenAIApi from "openai";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./mongodb/connect.js";
import postRoute from "./routes/PostRoute.js";
import dalleRoute from "./routes/DalleRoute.js";

const corsOptions = {
  origin: "https://coolartgen.onrender.com",
  methods: ["GET", "POST"],
  allowedHeaders:'*',
};

dotenv.config();
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
    
    // Check OpenAI connection
    let openaiStatus = "unknown";
    try {
      // simple models list request to check API access
      await openai.models.list();
      openaiStatus = "connected";
    } catch (error) {
      openaiStatus = "error";
      console.error("OpenAI health check failed:", error.message);
    }

    // Check Cloudinary connection
    let cloudinaryStatus = "unknown";
    try {
      await cloudinary.api.ping();
      cloudinaryStatus = "connected";
    } catch (error) {
      cloudinaryStatus = "error";
      console.error("Cloudinary health check failed:", error.message);
    }

    const healthStatus = {
      status: "OK",
      timestamp: new Date().toISOString(),
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
      database: {
        status: dbStatus
      },
      openai: {
        status: openaiStatus
      },
      cloudinary: {
        status: cloudinaryStatus
      }
    };

    // If service is down, return 503
    if (dbStatus !== "connected" || openaiStatus !== "connected" || cloudinaryStatus !== "connected") {
      res.status(503).json({
        ...healthStatus,
        status: "ERROR",
        message: "One or more services not connected"
      });
    } else {
      res.status(200).json(healthStatus);
    }
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
