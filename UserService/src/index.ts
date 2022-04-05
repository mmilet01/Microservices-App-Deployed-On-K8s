import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { allUsersRouter } from "./routes/all-users";
import cors from "cors";
import { errorHandler, NotFoundError } from "@mmilet-microservices/common";
import { natsWrapper } from "./nats-wrapper";
import { singleUserRouter } from "./routes/get-user-by-id";

const app = express();

app.set("trust proxy", true);
app.use(
  cors({
    origin: "*",
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static("public"));

app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(currentUserRouter);
app.use(allUsersRouter);
app.use(singleUserRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

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

    await mongoose.connect("mongodb://users-mongo-srv:27017/users", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to MONGODB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Started");
  });
};

start();
