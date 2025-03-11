import express from 'express';
import { auth } from '../middleware/auth.js';
import { estimationController } from '../controllers/estimationController.js';

const router = express.Router();

// Income Routes
router.get('/income', auth, estimationController.getEstimatedIncome);
router.post('/income/row', auth, estimationController.addIncomeRow);
router.put('/income/row/:rowId', auth, estimationController.updateIncomeRow);
router.delete('/income/row/:rowId', auth, estimationController.deleteIncomeRow);
router.put('/income/column/:columnId', auth, estimationController.updateIncomeColumn);
router.delete('/income/column/:columnId', auth, estimationController.deleteIncomeColumn);
router.put('/income/columns/order', auth, estimationController.updateIncomeColumnOrder);

// Expense Routes
router.get('/expense', auth, estimationController.getEstimatedExpense);
router.post('/expense/row', auth, estimationController.addExpenseRow);
router.put('/expense/row/:rowId', auth, estimationController.updateExpenseRow);
router.delete('/expense/row/:rowId', auth, estimationController.deleteExpenseRow);
router.put('/expense/column/:columnId', auth, estimationController.updateExpenseColumn);
router.delete('/expense/column/:columnId', auth, estimationController.deleteExpenseColumn);
router.put('/expense/columns/order', auth, estimationController.updateExpenseColumnOrder);

// Estimated Stats Route
router.get('/stats', auth, estimationController.getEstimatedStats);

export default router;
