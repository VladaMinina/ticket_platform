import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting new ...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be provided");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be provided");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongo");
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

start();
