import {
  BadRequestError,
  requestValidationMiddleware,
} from "@mmilet-microservices/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [body("email").isEmail().withMessage("Invalid email")],
  requestValidationMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).exec();
    if (!user) throw new BadRequestError("Invalid credentials");
    if (password) {
      try {
        user.validatePassword(password);
      } catch (err) {
        throw new BadRequestError("Invalid credentialsss");
      }
    } else {
      throw new BadRequestError("No Password Provided");
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    return res.status(200).send({ user, token });
  }
);

export { router as signInRouter };
