import {
    registerUser,
    sendLoginOTP,
    verifyLoginOTP,
    completeProfile,
    logoutUser,
    getUser,
    getAllUsers,
    getUserById
} from "../controllers/userController.js";
import {userAuth} from "../middleware/auth.js";
import express from "express";

const router = express.Router();
router.post("/register", registerUser);
router.post("/verify", sendLoginOTP);
router.post("/login", verifyLoginOTP);
router.post("/logout", userAuth, logoutUser);
router.get("/getUser",userAuth,getUser);
router.get("/",getAllUsers);
router.get("/:id",userAuth, getUserById);
router.patch("/completeProfile",userAuth, completeProfile);

export default router;