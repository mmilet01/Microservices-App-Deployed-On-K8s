import express, { Request, Response } from "express";
import { User } from "../models/user";
import { currentUser, requireAuth } from "@mmilet-microservices/common";

const router = express.Router();

router.get(
  "/api/users/allusers",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const users = await User.find();

    return res.status(200).send(users);
  }
);

export { router as allUsersRouter };
