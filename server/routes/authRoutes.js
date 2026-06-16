const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
} = require(
  "../controllers/authController"
);

const router =
  express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.put(
  "/profile",
  updateProfile
);

router.put(
  "/change-password",
  changePassword
);

module.exports =
  router;