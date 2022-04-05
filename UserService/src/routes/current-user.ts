import express from "express";
import { requireAuth, currentUser } from "@mmilet-microservices/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {
  return res.status(200).send(req.currentUser);
});

export { router as currentUserRouter };
