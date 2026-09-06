import express from 'express';
import IncomeController from '../Controllers/Income.ts';
const router = express.Router();
router.post("/", IncomeController.add);
router.get("/", IncomeController.get);
router.get("/:id", IncomeController.getIncomeId);
router.delete("/:id", IncomeController.deleteIncome);
router.put("/:id", IncomeController.updateIncome);
export default router;
