import express from "express";
import { requireAuth, currentUser } from "@mmilet-microservices/common";
import { Message } from "../models/messages";

const router = express.Router();

router.post(
  "/api/chat/message/:id",
  currentUser,
  requireAuth,
  async (req, res) => {
    const newMessage = Message.build({
      from: req.body.from,
      to: req.body.to,
      message: req.body.message,
    });
    try {
      await newMessage.save();
    } catch (err) {
      console.log("error saving data", err);
    }

    return res.status(200).send();
  }
);

export { router as sendMessageRouter };
