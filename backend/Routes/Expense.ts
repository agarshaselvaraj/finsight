import express from 'express';
import ExpenseController from '../Controllers/Expense';
const router = express.Router();
router.post("/", ExpenseController.add);
router.get("/:userId", ExpenseController.getExpense);
router.get("/:id", ExpenseController.getExpenseById);
router.delete("/:id", ExpenseController.deleteExpense);
router.put("/:id", ExpenseController.updateExpense);
export default router;
