const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getGeneralReport,
  backupSystem
} = require("../controllers/managerController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// User Management
router.get("/users", verifyToken, authorizeRoles("MANAGER", "ADMIN"), getUsers);
router.post("/users", verifyToken, authorizeRoles("MANAGER", "ADMIN"), createUser);
router.put("/users/:id", verifyToken, authorizeRoles("MANAGER", "ADMIN"), updateUser);
router.delete("/users/:id", verifyToken, authorizeRoles("MANAGER", "ADMIN"), deleteUser);

// General Reports
router.get("/reports/general", verifyToken, authorizeRoles("MANAGER", "ADMIN"), getGeneralReport);

// System Backup
router.post("/system/backup", verifyToken, authorizeRoles("ADMIN"), backupSystem);

module.exports = router;
