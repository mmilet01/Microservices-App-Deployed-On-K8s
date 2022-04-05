import express, { Request, Response } from "express";
import { body } from "express-validator"; // validation of a body
import {
  BadRequestError,
  requestValidationMiddleware,
} from "@mmilet-microservices/common";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { natsWrapper } from "../nats-wrapper";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";

const router = express.Router();

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/api/users/signup", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, photoPath } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Email in use");
  }

  const user = User.build({
    email,
    password,
    firstName,
    lastName,
    photoPath,
  });
  await user.save();
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_KEY!
  );

  await new UserCreatedPublisher(natsWrapper.client).publish({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user.id,
    photoPath: user.photoPath,
  });

  return res.status(201).send({ user, token });
});

/* 
  [
    body("email").isEmail().withMessage("Email must be validd"),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password must be more than 4 characters"),
    body("firstName").exists().withMessage("First name is required"),
    body("lastName").exists().withMessage("Last name is required"),
  ],
  requestValidationMiddleware, */

export { router as signUpRouter };
