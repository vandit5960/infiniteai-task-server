import express from "express";
import { logout, signin, signup } from "../controller/auth.js";
import {
  adminMiddleware,
  authMiddleware,
  userMiddleware,
} from "../middleware/auth.js";
import { deleteUsers, getAdminUsers, getUsers,updateUsers } from "../controller/users.js";

const router = express.Router();

router.get("/user", authMiddleware, userMiddleware, getUsers);
router.get("/admin", authMiddleware, adminMiddleware,getAdminUsers);
router.get("/delete/:id", authMiddleware, adminMiddleware,deleteUsers);
router.post("/update", authMiddleware, adminMiddleware,updateUsers);
export default router;
