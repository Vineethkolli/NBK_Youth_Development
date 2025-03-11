import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../utils/config';
import EstimatedIncomeTable from '../components/estimation/IncomeTable';
import EstimatedExpenseTable from '../components/estimation/ExpenseTable';
import EstimationStats from '../components/estimation/Stats';

function Estimation() {
  const { user } = useAuth();
  // Add a "stats" tab along with income and expense
  const [activeTab, setActiveTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalEstimatedIncome: 0,
    totalEstimatedPaidIncome: 0,
    totalEstimatedNotPaidIncome: 0,
    totalEstimatedExpense: 0,
    balance: 0
  });

  // Income state
  const [incomes, setIncomes] = useState([]);
  const [incomeFilters, setIncomeFilters] = useState({
    status: '',
    belongsTo: '',
    sortField: 'currentAmount',
    sortOrder: 'desc'
  });
  const [incomeColumns, setIncomeColumns] = useState({
    sno: true,
    name: true,
    previousYearAmount: true,
    currentAmount: true,
    category: true,
    status: true,
    others: true
  });

  // Expense state
  const [expenses, setExpenses] = useState([]);
  const [expenseColumns, setExpenseColumns] = useState({
    sno: true,
    purpose: true,
    previousYearAmount: true,
    currentAmount: true,
    contact: false,
    others: false
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, incomeFilters]);

  const fetchData = async () => {
    try {
      // Always fetch stats (needed in the stats tab)
      const statsResponse = await axios.get(`${API_URL}/api/estimation/stats`);
      setStats(statsResponse.data);

      // Fetch income or expense only if that tab is active
      if (activeTab === 'income') {
        const { data } = await axios.get(`${API_URL}/api/estimation/income`, {
          params: incomeFilters
        });
        setIncomes(data);
      } else if (activeTab === 'expense') {
        const { data } = await axios.get(`${API_URL}/api/estimation/expense`);
        setExpenses(data);
      }
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab} data`);
    }
  };

  // (Handlers for income and expense add/update/delete remain unchanged)
  const handleIncomeAdd = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/api/estimation/income`, {
        name: 'New Income',
        currentAmount: 0,
        category: 'youth',
        status: 'not paid',
        c
      });
      setIncomes([...incomes, data]);
    } catch (error) {
      toast.error('Failed to add income');
    }
  };

  const handleIncomeUpdate = async (id, updates) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/estimation/income/${id}`, updates);
      setIncomes(incomes.map(income => income._id === id ? data : income));
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to update income');
    }
  };

  const handleIncomeDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/estimation/income/${id}`);
      setIncomes(incomes.filter(income => income._id !== id));
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete income');
    }
  };

  const handleExpenseAdd = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/api/estimation/expense`, {
        purpose: 'New Expense',
        currentAmount: 0
      });
      setExpenses([...expenses, data]);
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleExpenseUpdate = async (id, updates) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/estimation/expense/${id}`, updates);
      setExpenses(expenses.map(expense => expense._id === id ? data : expense));
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to update expense');
    }
  };

  const handleExpenseDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/estimation/expense/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const handleSort = (field) => {
    setIncomeFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (!['developer', 'financier'].includes(user?.role)) {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Estimation Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'income'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'expense'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md ${
              isEditing ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <EstimationStats stats={stats} />
      )}

      {activeTab === 'income' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={incomeFilters.status}
              onChange={(e) => setIncomeFilters({ ...incomeFilters, status: e.target.value })}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="not paid">Not Paid</option>
            </select>
            <select
              value={incomeFilters.belongsTo}
              onChange={(e) => setIncomeFilters({ ...incomeFilters, belongsTo: e.target.value })}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="youth">Youth</option>
              <option value="villagers">Villagers</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-medium">Visible Columns</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(incomeColumns).map(([column, isVisible]) => (
                  <label key={column} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => setIncomeColumns({ ...incomeColumns, [column]: !isVisible })}
                      className="form-checkbox"
                    />
                    <span className="ml-2 text-sm">{column}</span>
                  </label>
                ))}
              </div>
            </div>

            <EstimatedIncomeTable
              incomes={incomes}
              visibleColumns={incomeColumns}
              isEditing={isEditing}
              onAdd={handleIncomeAdd}
              onUpdate={handleIncomeUpdate}
              onDelete={handleIncomeDelete}
            />
          </div>
        </div>
      )}

      {activeTab === 'expense' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-medium">Visible Columns</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(expenseColumns).map(([column, isVisible]) => (
                  <label key={column} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => setExpenseColumns({ ...expenseColumns, [column]: !isVisible })}
                      className="form-checkbox"
                    />
                    <span className="ml-2 text-sm">{column}</span>
                  </label>
                ))}
              </div>
            </div>

            <EstimatedExpenseTable
              expenses={expenses}
              visibleColumns={expenseColumns}
              isEditing={isEditing}
              onAdd={handleExpenseAdd}
              onUpdate={handleExpenseUpdate}
              onDelete={handleExpenseDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Estimation;
