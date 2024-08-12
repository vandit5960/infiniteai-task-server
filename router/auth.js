import express from "express";
import { logout, signin, signup } from "../controller/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/logout", logout);
export default router;
