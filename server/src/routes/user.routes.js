import { registerUser,loginUser, getUserData, logoutUser, getCars } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter=Router();

userRouter.route("/register")
        .post(upload.fields([{name:"image",maxCount:1}]),registerUser)

userRouter.route("/login").post(loginUser)
userRouter.route("/data").get(verifyJWT,getUserData)
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/cars").get(getCars)


export default userRouter;