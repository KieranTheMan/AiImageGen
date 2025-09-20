import express from "express";
import * as dotenv from "dotenv";
import Configuration from "openai";
import OpenAIApi from "openai";

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apikey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiResponse = await openai.images.generate({
      model:'dall-e-3',
      prompt:prompt,
      size:"1024x1024",
      quality:'standard',
      n:1,
      //response_format:'b64_json'
  });
    const image = aiResponse.data[0].url;
    // eslint-disable-next-line no-console
    console.log("DALL-E response:", aiResponse);
    res.status(200).json({ photo: image });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("DALL-E API error:", error);
    res.status(500).send(error?.response?.data?.error?.message || "Image generation failed");
  }
});

export default router;
