import express, { Request, Response } from "express";
import { User } from "../models/user";
import { currentUser, requireAuth } from "@mmilet-microservices/common";

const router = express.Router();

router.get(
  "/api/users/user/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    return res.status(200).send(user);
  }
);

export { router as singleUserRouter };
