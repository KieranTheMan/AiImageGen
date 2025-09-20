import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(url)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("MongoDB connected");
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("MongoDB connection error:", error);
    });
};

export default connectDB;
