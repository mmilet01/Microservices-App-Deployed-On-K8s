import express, { Request, Response } from "express";
import { BadRequestError } from "@mmilet-microservices/common";
import { User } from "../models/user";
import { UserRelationship } from "../models/user-relationship";
import { UserRelationshipStatus } from "../enums/user-relationship-status";

const router = express.Router();

router.post(
  "/api/users/friendRequestRecieved/:id",
  async (req: Request, res: Response) => {
    // When searching user relationship with another user - by id
    // We will only search by one column and the other one will represent currentUserId
    const recieverId = req.query.id as string;
    const user = await User.findOne({ id: recieverId });
    if (!user) return new BadRequestError("No user found with that id");

    const senderId = user.id as string;

    const firstStatus = UserRelationshipStatus.FriendRequestRecieved;
    const secondStatus = UserRelationshipStatus.FriendRequestSent;

    // SEND FRIEND REQUEST RECIEVED EVENT - NOTIFICATION
    const firstUserRelationship = UserRelationship.build({
      firstUserId: recieverId,
      secondUserId: senderId,
      status: firstStatus,
    });

    const secondUserRelationship = UserRelationship.build({
      firstUserId: senderId,
      secondUserId: recieverId,
      status: secondStatus,
    });

    await firstUserRelationship.save();
    await secondUserRelationship.save();

    return res.status(200).send({});
  }
);

export { router as friendReqRecievedRouter };
