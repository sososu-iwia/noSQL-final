import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", authMiddleware, getCurrentUser);
userRouter.get("/:id", authMiddleware, adminMiddleware);
userRouter.put("/update", authMiddleware, updateCurrentUser);

export default userRouter;
