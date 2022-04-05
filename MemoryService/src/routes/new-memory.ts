import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  currentUser,
  requestValidationMiddleware,
} from "@mmilet-microservices/common";
import { Memory } from "../models/memory";
import multer from "multer";
import path from "path";
import { User } from "../models/user";

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

router.post(
  "/api/memories/newMemory",
  [body("title").exists().withMessage("Title is requiredd")],
  requestValidationMiddleware,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { title, description, photoPath } = req.body;
    const createdBy = req.currentUser!.id;

    const user = await User.findById(createdBy);
    let memory;
    if (user) {
      memory = Memory.build({
        createdBy,
        userName: user.firstName,
        userPhotoPath: user.photoPath,
        title,
        description,
        photoPath,
      });

      await memory.save();
    }

    return res.status(200).send(memory);
  }
);

export { router as createMemoryRouter };
