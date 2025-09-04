import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";  
import {verifyJwt} from "../middlewares/auth.middlewares.js"

const router = Router();

// Example: handle file uploads with Multer
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);
router.route("/login").post(loginUser)

// secure routes

router.route("./logout").post(verifyJwt ,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router;
