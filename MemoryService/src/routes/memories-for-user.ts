import express from "express";
import { requireAuth, currentUser } from "@mmilet-microservices/common";
import { Memory } from "../models/memory";

const router = express.Router();

router.get(
  "/api/memories/user/:id",
  currentUser,
  requireAuth,
  async (req, res) => {
    const memories = await Memory.find({
      createdBy: req.params.id,
    });

    return res.status(200).send(memories);
  }
);

export { router as getMemoriesForUserRouter };
