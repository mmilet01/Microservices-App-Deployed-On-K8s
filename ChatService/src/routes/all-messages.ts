import express from "express";
import { requireAuth, currentUser } from "@mmilet-microservices/common";
import { Message } from "../models/messages";

const router = express.Router();

router.get("/api/chat/messages", currentUser, requireAuth, async (req, res) => {
  let messages;
  try {
    messages = await Message.find();
  } catch (err) {
    console.log("err", err);
  }

  return res.status(200).send(messages);
});

export { router as allMessageRouter };
