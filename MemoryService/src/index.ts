import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import { errorHandler } from "@mmilet-microservices/common";
import { getMemoriesRouter } from "./routes/memory-list";
import { createMemoryRouter } from "./routes/new-memory";
import { getSingleMemory } from "./routes/single-memory";
import { getMemoriesForUserRouter } from "./routes/memories-for-user";
import { getMyMemoriesRouter } from "./routes/my-memories";
import { natsWrapper } from "./nats-wrapper";
import { getUsersRouter } from "./routes/users";
import { UserCreatedListener } from "./events/listeners/user-created-listener";
import { UserUpdatedListener } from "./events/listeners/user-updated-listener";
import cors from "cors";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/public", express.static("public"));

app.use(createMemoryRouter);
app.use(getMemoriesRouter);
app.use(getSingleMemory);
app.use(getMemoriesForUserRouter);
app.use(getMyMemoriesRouter);
app.use(getUsersRouter);

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new UserCreatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect("mongodb://memory-mongo-srv:27017/memory", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to memory MONGODB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Started");
  });
};

start();
