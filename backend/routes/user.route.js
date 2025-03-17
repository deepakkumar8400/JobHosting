import express from "express";
import passport from "passport";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Manual Registration and Login
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

// Google OAuth Routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://dpkjob3713.onrender.com",
    failureRedirect: "https://dpkjob3713.onrender.com/login",
  })
);

// GitHub OAuth Routes
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "https://dpkjob3713.onrender.com",
    failureRedirect: "https://dpkjob3713.onrender.com/login",
  })
);

export default router;
