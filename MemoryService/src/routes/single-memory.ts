import express from "express";
import { requireAuth, currentUser } from "@mmilet-microservices/common";
import { Memory } from "../models/memory";

const router = express.Router();

router.get(
  "/api/memories/memory/:id",
  requireAuth,
  currentUser,
  async (req, res) => {
    const memory = await Memory.findById(req.params.id);
    return res.status(200).send(memory);
  }
);

export { router as getSingleMemory };
