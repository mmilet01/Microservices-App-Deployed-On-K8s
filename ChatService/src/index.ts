import express from "express";
import cookieParser from "cookie-parser";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import redis from "redis";

import { getMessageRouter } from "./routes/messages";
import { Message } from "./models/messages";
import { getUsersRouter } from "./routes/users";
import { natsWrapper } from "./natsWrapper";
import { UserCreatedListener } from "./events/listeners/user-created-listener";
import { UserUpdatedListener } from "./events/listeners/user-updated-listener";
import { sendMessageRouter } from "./routes/send-message";
import { allMessageRouter } from "./routes/all-messages";
/* 
const client = redis.createClient({
  host: "redis-srv",
  port: 6379,
});

client.on("connect", () => {
  console.log("Redis client connected successfully");
});

client.on("error", (err) => {
  console.log("Erroring on connection " + err);
}); */

const app = express();

app.set("trust proxy", true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(getUsersRouter);
app.use(getMessageRouter);
app.use(sendMessageRouter);
app.use(allMessageRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["*"],
  },
});

// map of key value pairs (userid, socketid);
const activeUsersMap = new Map();
// socket.emit -> to connected user
// socket.broadcast.emit -> to all user except connected
// io.emit -> all clients in general

/* 
io.on('message') */
interface UserPayload {
  id: string;
  email: string;
}

io.on("connection", (socket) => {
  const token = socket.handshake.headers.authorization?.split(" ")[1];
  let user;
  let userId: any;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
      userId = user.id;
    } catch (err) {
      console.log("err");
    }
  }

  console.log("Socket succesfully connected with id: " + socket.id);

  activeUsersMap.set(userId, socket.id);

  /*   client.set(userId, socket.id);
   */

  socket.on("messageSent", async (payload: socketMessagePayaload) => {
    const newMessage = Message.build({
      from: userId,
      to: payload.selectedId,
      message: payload.messageObj.message,
    });
    await newMessage.save();
    const userSocket = activeUsersMap.get(payload.selectedId);
    io.to(userSocket).emit("messageRecieved", payload);
  });

  socket.on("removeSocketId", (userId) => {
    activeUsersMap.delete(userId);
    /*     client.del(userId);
     */
  });

  socket.on("disconnect", (data) => {
    console.log("disconnecting", data);
  });
});

const start = async () => {
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

    await mongoose.connect("mongodb://chat-mongo-srv:27017/chat", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to chat MONGODB");
  } catch (err) {
    console.log(err);
  }

  server.listen(3000, () => {
    console.log("Started");
  });
};

start();

interface Message {
  from: string;
  to: string;
  message: string;
}

interface socketMessagePayaload {
  messageObj: Message;
  selectedId: string;
}

export default io;
