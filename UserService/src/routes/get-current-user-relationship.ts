import express, { Request, Response } from "express";
import { currentUser, requireAuth } from "@mmilet-microservices/common";
import { UserRelationship } from "../models/user-relationship";

const router = express.Router();

router.post(
  "/api/users/relationshipStatus/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const relationshipWithId = req.query.id as string;
    const relationshipStatus = await UserRelationship.findOne({
      firstUserId: relationshipWithId,
      secondUserId: req.currentUser!.id,
    });

    return res
      .status(200)
      .send({ relationshipStatus: relationshipStatus!.status });
  }
);

export { router as currentUserRelationshipRouter };
