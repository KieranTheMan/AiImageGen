import express from "express";
import * as dotenv from "dotenv";
// import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoute from "./routes/PostRoute.js";
import dalleRoute from "./routes/DalleRoute.js";

// const corsOptions = {
//   origin: "https://coolartgen.onrender.com",
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"],
// };

dotenv.config();
const app = express();

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoute);
app.use("/api/v1/dalle", dalleRoute);

app.get("/", async (req, res) => {
  res.send("Hello API");
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8000, () =>
    console.log("Server has started on port http://localhost:8000")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
