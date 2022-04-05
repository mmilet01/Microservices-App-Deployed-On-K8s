import express from "express";
import { requireAuth, currentUser } from "@mmilet-microservices/common";
import { User } from "../models/user";

const router = express.Router();

router.get("/api/chat/users", currentUser, requireAuth, async (req, res) => {
  const users = await User.find();
  return res.status(200).send(users);
});

export { router as getUsersRouter };
