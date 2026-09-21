const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
