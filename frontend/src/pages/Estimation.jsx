import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../utils/config';
import IncomeTable from '../components/estimation/IncomeTable';
import ExpenseTable from '../components/estimation/ExpenseTable';
import EstimatedStats from '../components/estimation/EstimatedStats';

function Estimation() {
  const [activeTab, setActiveTab] = useState('income');
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomeData, setIncomeData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    if (activeTab === 'income') {
      fetchIncome();
    } else if (activeTab === 'expense') {
      fetchExpense();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchIncome = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/estimation/income`);
      setIncomeData(data);
    } catch (error) {
      toast.error('Failed to fetch income data');
    }
  };

  const fetchExpense = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/estimation/expense`);
      setExpenseData(data);
    } catch (error) {
      toast.error('Failed to fetch expense data');
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/estimation/stats`);
      setStatsData(data);
    } catch (error) {
      toast.error('Failed to fetch estimated stats');
    }
  };

  // ----- Income Handlers -----
  const handleAddIncomeRow = async () => {
    try {
      const newRow = { name: '', prevAmt: 0, currAmt: 0, category: 'youth', status: 'not paid', informed: 0, others: '' };
      const { data } = await axios.post(`${API_URL}/api/estimation/income/row`, newRow);
      setIncomeData(data);
    } catch (error) {
      toast.error('Failed to add income row');
    }
  };

  const handleUpdateIncomeRow = async (rowId, updatedData) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/estimation/income/row/${rowId}`, updatedData);
      setIncomeData(data);
    } catch (error) {
      toast.error('Failed to update income row');
    }
  };

  const handleDeleteIncomeRow = async (rowId) => {
    try {
      const { data } = await axios.delete(`${API_URL}/api/estimation/income/row/${rowId}`);
      setIncomeData(data);
    } catch (error) {
      toast.error('Failed to delete income row');
    }
  };

  const handleUpdateIncomeColumn = async (columnId, newHeader) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/estimation/income/column/${columnId}`, { header: newHeader });
      setIncomeData(data);
    } catch (error) {
      toast.error('Failed to update income column');
    }
  };

  // ----- Expense Handlers -----
  const handleAddExpenseRow = async () => {
    try {
      const newRow = { purpose: '', prevAmt: 0, currAmt: 0, contact: '', others: '' };
      const { data } = await axios.post(`${API_URL}/api/estimation/expense/row`, newRow);
      setExpenseData(data);
    } catch (error) {
      toast.error('Failed to add expense row');
    }
  };

  const handleUpdateExpenseRow = async (rowId, updatedData) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/estimation/expense/row/${rowId}`, updatedData);
      setExpenseData(data);
    } catch (error) {
      toast.error('Failed to update expense row');
    }
  };

  const handleDeleteExpenseRow = async (rowId) => {
    try {
      const { data } = await axios.delete(`${API_URL}/api/estimation/expense/row/${rowId}`);
      setExpenseData(data);
    } catch (error) {
      toast.error('Failed to delete expense row');
    }
  };

  const handleUpdateExpenseColumn = async (columnId, newHeader) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/estimation/expense/column/${columnId}`, { header: newHeader });
      setExpenseData(data);
    } catch (error) {
      toast.error('Failed to update expense column');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Estimation</h1>
        <div className="space-x-4">
          <button onClick={() => setActiveTab('income')} className={`px-4 py-2 rounded-md ${activeTab === 'income' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Income
          </button>
          <button onClick={() => setActiveTab('expense')} className={`px-4 py-2 rounded-md ${activeTab === 'expense' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Expense
          </button>
          <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-md ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Estimated Stats
          </button>
          <button onClick={() => setIsEditMode(!isEditMode)} className={`px-4 py-2 rounded-md ${isEditMode ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
            {isEditMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      {activeTab === 'income' && incomeData && (
        <IncomeTable
          isEditMode={isEditMode}
          columns={incomeData.columns}
          rows={incomeData.rows}
          onAddRow={handleAddIncomeRow}
          onUpdateRow={handleUpdateIncomeRow}
          onDeleteRow={handleDeleteIncomeRow}
          onUpdateColumn={handleUpdateIncomeColumn}
        />
      )}

      {activeTab === 'expense' && expenseData && (
        <ExpenseTable
          isEditMode={isEditMode}
          columns={expenseData.columns}
          rows={expenseData.rows}
          onAddRow={handleAddExpenseRow}
          onUpdateRow={handleUpdateExpenseRow}
          onDeleteRow={handleDeleteExpenseRow}
          onUpdateColumn={handleUpdateExpenseColumn}
        />
      )}

      {activeTab === 'stats' && statsData && (
        <EstimatedStats stats={statsData} />
      )}
    </div>
  );
}

export default Estimation;
