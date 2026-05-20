const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/profile", verifyToken, getProfile);
router.put("/auth/profile", verifyToken, updateProfile);

module.exports = router;
