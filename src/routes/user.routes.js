import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getuserChaneelProfile, getWatchHistory } from "../controllers/user.controller.js";
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
router.route("/change-password").post(verifyJwt,changeCurrentPassword)
router.route("/current-user").get(verifyJwt,getCurrentUser)
router.route("/update-account").patch(verifyJwt,updateAccountDetails)
router.route("/avatar").patch(verifyJwt, upload.single("avatar"),updateUserAvatar)
router.route("/cover-Image").patch(verifyJwt,upload.single("/coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJwt,getuserChaneelProfile)
router.route("/history").get(verifyJwt,getWatchHistory)

export default router;
