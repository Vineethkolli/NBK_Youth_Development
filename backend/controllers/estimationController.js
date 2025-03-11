import EstimatedIncome from '../models/EstimatedIncome.js';
import EstimatedExpense from '../models/EstimatedExpense.js';

export const estimationController = {
  // ----- Income Endpoints -----
  getEstimatedIncome: async (req, res) => {
    try {
      let income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      if (!income) {
        income = new EstimatedIncome({
          columns: [
            { id: 'sno', header: 'S.No', type: 'numeric', order: 0 },
            { id: 'name', header: 'Name', type: 'string', order: 1 },
            { id: 'prevAmt', header: 'Previous Year Amount', type: 'amount', order: 2 },
            { id: 'currAmt', header: 'Current Amount', type: 'amount', order: 3 },
            { id: 'category', header: 'Category', type: 'string', order: 4 },
            { id: 'status', header: 'Status', type: 'string', order: 5 },
            { id: 'informed', header: 'Informed', type: 'numeric', order: 6 },
            { id: 'others', header: 'Others', type: 'string', order: 7 }
          ],
          rows: [],
          createdBy: req.user.registerId
        });
        await income.save();
      }
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimated income' });
    }
  },

  addIncomeRow: async (req, res) => {
    try {
      const { name, prevAmt, currAmt, category, status, informed, others } = req.body;
      let income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      if (!income) return res.status(404).json({ message: 'Income data not found' });
      const newRow = {
        id: `row_${Date.now()}`,
        name: name || '',
        prevAmt: prevAmt || 0,
        currAmt: currAmt || 0,
        category: category || 'youth',
        status: status || 'not paid',
        informed: informed || 0,
        others: others || ''
      };
      income.rows.push(newRow);
      await income.save();
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add income row' });
    }
  },

  updateIncomeRow: async (req, res) => {
    try {
      const { rowId } = req.params;
      const updateData = req.body;
      let income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      if (!income) return res.status(404).json({ message: 'Income data not found' });
      const rowIndex = income.rows.findIndex(row => row.id === rowId);
      if (rowIndex === -1) return res.status(404).json({ message: 'Row not found' });
      income.rows[rowIndex] = { ...income.rows[rowIndex], ...updateData };
      await income.save();
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update income row' });
    }
  },

  deleteIncomeRow: async (req, res) => {
    try {
      const { rowId } = req.params;
      let income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      if (!income) return res.status(404).json({ message: 'Income data not found' });
      income.rows = income.rows.filter(row => row.id !== rowId);
      await income.save();
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete income row' });
    }
  },

  updateIncomeColumn: async (req, res) => {
    try {
      const { columnId } = req.params;
      const { header } = req.body;
      let income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      if (!income) return res.status(404).json({ message: 'Income data not found' });
      const colIndex = income.columns.findIndex(col => col.id === columnId);
      if (colIndex === -1) return res.status(404).json({ message: 'Column not found' });
      income.columns[colIndex].header = header;
      await income.save();
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update income column' });
    }
  },

  deleteIncomeColumn: async (req, res) => {
    try {
      const { columnId } = req.params;
      let income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      if (!income) return res.status(404).json({ message: 'Income data not found' });
      // Prevent deletion of default columns
      if (['sno', 'name', 'prevAmt', 'currAmt', 'category', 'status', 'informed', 'others'].includes(columnId)) {
        return res.status(400).json({ message: 'Cannot delete default column' });
      }
      income.columns = income.columns.filter(col => col.id !== columnId);
      await income.save();
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete income column' });
    }
  },

  updateIncomeColumnOrder: async (req, res) => {
    try {
      const { columns } = req.body;
      let income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      if (!income) return res.status(404).json({ message: 'Income data not found' });
      income.columns = columns;
      await income.save();
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update income column order' });
    }
  },

  // ----- Expense Endpoints -----
  getEstimatedExpense: async (req, res) => {
    try {
      let expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      if (!expense) {
        expense = new EstimatedExpense({
          columns: [
            { id: 'sno', header: 'S.No', type: 'numeric', order: 0 },
            { id: 'purpose', header: 'Purpose', type: 'string', order: 1 },
            { id: 'prevAmt', header: 'Previous Year Amount', type: 'amount', order: 2 },
            { id: 'currAmt', header: 'Current Amount', type: 'amount', order: 3 },
            { id: 'contact', header: 'Contact', type: 'string', order: 4 },
            { id: 'others', header: 'Others', type: 'string', order: 5 }
          ],
          rows: [],
          createdBy: req.user.registerId
        });
        await expense.save();
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimated expense' });
    }
  },

  addExpenseRow: async (req, res) => {
    try {
      const { purpose, prevAmt, currAmt, contact, others } = req.body;
      let expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      if (!expense) return res.status(404).json({ message: 'Expense data not found' });
      const newRow = {
        id: `row_${Date.now()}`,
        purpose: purpose || '',
        prevAmt: prevAmt || 0,
        currAmt: currAmt || 0,
        contact: contact || '',
        others: others || ''
      };
      expense.rows.push(newRow);
      await expense.save();
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add expense row' });
    }
  },

  updateExpenseRow: async (req, res) => {
    try {
      const { rowId } = req.params;
      const updateData = req.body;
      let expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      if (!expense) return res.status(404).json({ message: 'Expense data not found' });
      const rowIndex = expense.rows.findIndex(row => row.id === rowId);
      if (rowIndex === -1) return res.status(404).json({ message: 'Row not found' });
      expense.rows[rowIndex] = { ...expense.rows[rowIndex], ...updateData };
      await expense.save();
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update expense row' });
    }
  },

  deleteExpenseRow: async (req, res) => {
    try {
      const { rowId } = req.params;
      let expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      if (!expense) return res.status(404).json({ message: 'Expense data not found' });
      expense.rows = expense.rows.filter(row => row.id !== rowId);
      await expense.save();
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete expense row' });
    }
  },

  updateExpenseColumn: async (req, res) => {
    try {
      const { columnId } = req.params;
      const { header } = req.body;
      let expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      if (!expense) return res.status(404).json({ message: 'Expense data not found' });
      const colIndex = expense.columns.findIndex(col => col.id === columnId);
      if (colIndex === -1) return res.status(404).json({ message: 'Column not found' });
      expense.columns[colIndex].header = header;
      await expense.save();
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update expense column' });
    }
  },

  deleteExpenseColumn: async (req, res) => {
    try {
      const { columnId } = req.params;
      let expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      if (!expense) return res.status(404).json({ message: 'Expense data not found' });
      if (['sno','purpose','prevAmt','currAmt','contact','others'].includes(columnId)) {
        return res.status(400).json({ message: 'Cannot delete default column' });
      }
      expense.columns = expense.columns.filter(col => col.id !== columnId);
      await expense.save();
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete expense column' });
    }
  },

  updateExpenseColumnOrder: async (req, res) => {
    try {
      const { columns } = req.body;
      let expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      if (!expense) return res.status(404).json({ message: 'Expense data not found' });
      expense.columns = columns;
      await expense.save();
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update expense column order' });
    }
  },

  // ----- Estimated Stats Endpoint -----
  getEstimatedStats: async (req, res) => {
    try {
      const income = await EstimatedIncome.findOne({ createdBy: req.user.registerId });
      const expense = await EstimatedExpense.findOne({ createdBy: req.user.registerId });
      let incomeTotal = 0, paidTotal = 0, notPaidTotal = 0;
      if (income) {
        income.rows.forEach(row => {
          incomeTotal += row.currAmt;
          if (row.status === 'paid') {
            paidTotal += row.currAmt;
          } else {
            notPaidTotal += row.currAmt;
          }
        });
      }
      let expenseTotal = 0;
      if (expense) {
        expense.rows.forEach(row => {
          expenseTotal += row.currAmt;
        });
      }
      const balance = incomeTotal - expenseTotal;
      res.json({
        income: {
          currentEstimatedIncome: incomeTotal,
          paid: paidTotal,
          notPaid: notPaidTotal
        },
        expense: {
          currentEstimatedExpense: expenseTotal
        },
        balance: balance
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch estimated stats' });
    }
  }
};

export default estimationController;
