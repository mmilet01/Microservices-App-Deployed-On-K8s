import express from "express";
import { currentUser, requireAuth } from "@mmilet-microservices/common";

const router = express.Router();

router.post("/api/users/signout", currentUser, requireAuth, (req, res) => {
  return res.status(200).send({});
});

export { router as signOutRouter };
