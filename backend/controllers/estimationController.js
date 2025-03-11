import EstimatedIncome from '../models/EstimatedIncome.js';
import EstimatedExpense from '../models/EstimatedExpense.js';

export const estimationController = {
  // Income Methods
  getAllEstimatedIncomes: async (req, res) => {
    try {
      const { sortOrder, sortField } = req.query;
      let query = EstimatedIncome.find();

      if (sortOrder && sortField) {
        const sortObj = {};
        sortObj[sortField] = sortOrder === 'desc' ? -1 : 1;
        query = query.sort(sortObj);
      } else {
        query = query.sort({ EIID: 1 });
      }

      const incomes = await query.exec();
      res.json(incomes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimated incomes' });
    }
  },

  createEstimatedIncome: async (req, res) => {
    try {
      const count = await EstimatedIncome.countDocuments();
      const income = await EstimatedIncome.create({
        ...req.body,
        EIID: "EI" + (count + 1)
      });
      res.status(201).json(income);
    } catch (error) {
      
    console.error('Error creating income:', error); // Log error details
      res.status(500).json({ message: 'Failed to create estimated income' });
    }
  },

  updateEstimatedIncome: async (req, res) => {
    try {
      const income = await EstimatedIncome.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update estimated income' });
    }
  },

  deleteEstimatedIncome: async (req, res) => {
    try {
      await EstimatedIncome.findByIdAndDelete(req.params.id);
      res.json({ message: 'Estimated income deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete estimated income' });
    }
  },

  // Expense Methods
  getAllEstimatedExpenses: async (req, res) => {
    try {
      const expenses = await EstimatedExpense.find().sort({ EEID: 1 });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimated expenses' });
    }
  },

  createEstimatedExpense: async (req, res) => {
    try {
      const count = await EstimatedExpense.countDocuments();
      const expense = await EstimatedExpense.create({
        ...req.body,
        EEID: "EE" + (count + 1)
      });
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create estimated expense' });
    }
  },

  updateEstimatedExpense: async (req, res) => {
    try {
      const expense = await EstimatedExpense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update estimated expense' });
    }
  },

  deleteEstimatedExpense: async (req, res) => {
    try {
      await EstimatedExpense.findByIdAndDelete(req.params.id);
      res.json({ message: 'Estimated expense deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete estimated expense' });
    }
  },

  // Stats Methods
  getEstimationStats: async (req, res) => {
    try {
      const incomes = await EstimatedIncome.find();
      const expenses = await EstimatedExpense.find();

      const totalEstimatedIncome = incomes.reduce((sum, income) => sum + income.currentAmount, 0);
      const totalEstimatedPaidIncome = incomes
        .filter(income => income.status === 'paid')
        .reduce((sum, income) => sum + income.currentAmount, 0);
      const totalEstimatedNotPaidIncome = totalEstimatedIncome - totalEstimatedPaidIncome;
      
      const totalEstimatedExpense = expenses.reduce((sum, expense) => sum + expense.currentAmount, 0);
      const balance = totalEstimatedIncome - totalEstimatedExpense;

      res.json({
        totalEstimatedIncome,
        totalEstimatedPaidIncome,
        totalEstimatedNotPaidIncome,
        totalEstimatedExpense,
        balance
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimation stats' });
    }
  }
};
