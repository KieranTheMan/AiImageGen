import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", async (req, res) => {
  res.send("Hello API");
});

const startServer = async () => {
  app.listen(8000, () =>
    console.log("Server has started on port http://localhost:8000")
  );
};

startServer();
