import express from 'express';
import CategoryController from '../Controllers/Category';
const router = express.Router();
router.post("/", CategoryController.add);
router.get("/", CategoryController.get);
// router.get("/:id", CategoryController.getExpenseById);
router.delete("/:id", CategoryController.deleteCategory);
router.put("/:id", CategoryController.updateCategory);
export default router;
