import express, { Request, Response } from "express";
import {
  BadRequestError,
  currentUser,
  requireAuth,
} from "@mmilet-microservices/common";
import { User } from "../models/user";
import { UserRelationship } from "../models/user-relationship";
import { UserRelationshipStatus } from "../enums/user-relationship-status";

const router = express.Router();

router.post(
  "/api/users/friendRequestResponded/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    // When searching user relationship with another user - by id
    // We will only search by one column and the other one will represent currentUserId
    // thats why upon inserting we insert 2 rows for same relationship with currentUserId being in both of them
    const recieverId = req.query.id as string;
    const user = await User.findOne({ id: recieverId });
    if (!user) return new BadRequestError("No user found with that id");
    const senderId = user.id as string;

    await UserRelationship.updateMany(
      {
        $or: [
          { $and: [{ firstUserId: recieverId }, { secondUserId: senderId }] },
          { $and: [{ firstUserId: senderId }, { secondUserId: recieverId }] },
        ],
      },
      {
        $set: {
          status: UserRelationshipStatus.Friends,
        },
      }
    );

    return res.status(200).send({});
  }
);

export { router as friendReqRespondRouter };
