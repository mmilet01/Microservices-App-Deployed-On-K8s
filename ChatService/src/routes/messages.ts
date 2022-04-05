import express from "express";
import { requireAuth, currentUser } from "@mmilet-microservices/common";
import { Message } from "../models/messages";

const router = express.Router();

router.get("/api/chat/:id", currentUser, requireAuth, async (req, res) => {
  const currUserId = req.currentUser?.id;
  const otherUserId = req.params.id;
  const messages = await Message.find({
    $or: [
      { $and: [{ from: currUserId }, { to: otherUserId }] },
      { $and: [{ from: otherUserId }, { to: currUserId }] },
    ],
  }).exec();
  return res.status(200).send(messages);
});

export { router as getMessageRouter };
