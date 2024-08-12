import express from "express";
import { 
  deleteProduct, 
  getAdminProduct, 
  getUserProduct, 
  insertProduct, 
  updateProduct ,
  getGroupedProducts
} from "../controller/productUser.js";

import { authMiddleware, adminMiddleware, userMiddleware, checkPermission, } from "../middleware/auth.js";

const router = express.Router();


router.post("/insert", authMiddleware,checkPermission("insert"), insertProduct);
router.put("/update/:id", authMiddleware,checkPermission("update"), updateProduct); 
router.delete("/delete/:id", authMiddleware,checkPermission("delete"), deleteProduct);
// router.get("/user/get", authMiddleware,checkPermission(), userMiddleware, getUserProduct);
router.get("/admin/gets", authMiddleware,checkPermission("select"), getAdminProduct);
router.get("/grouped",  getGroupedProducts);

export default router;
