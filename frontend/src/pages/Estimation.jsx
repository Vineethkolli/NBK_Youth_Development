import { useState, useEffect } from 'react';
import { Edit2, Filter} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../utils/config';
import EstimatedIncomeTable from '../components/estimation/IncomeTable';
import EstimatedExpenseTable from '../components/estimation/ExpenseTable';
import EstimationStats from '../components/estimation/Stats';
import EstimationForm from '../components/estimation/Form';
import { useAuth } from '../context/AuthContext';

function Estimation() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats'); // Default now is stats
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
  const [expenseFilters, setExpenseFilters] = useState({
    sortField: 'currentAmount',
    sortOrder: 'desc'
  });
  const [expenseColumns, setExpenseColumns] = useState({
    sno: true,
    purpose: true,
    previousYearAmount: true,
    currentAmount: true,
    contact: false,
    others: false
  });

  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formType, setFormType] = useState('income'); // 'income' or 'expense'
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, incomeFilters, expenseFilters]);

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsResponse = await axios.get(`${API_URL}/api/estimation/stats`);
      setStats(statsResponse.data);

      // Fetch data based on active tab
      if (activeTab === 'income') {
        const { data } = await axios.get(`${API_URL}/api/estimation/income`, {
          params: incomeFilters
        });
        setIncomes(data);
      } else if (activeTab === 'expense') {
        const { data } = await axios.get(`${API_URL}/api/estimation/expense`, {
          params: expenseFilters
        });
        setExpenses(data);
      }
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab} data`);
    }
  };

  // Income Delete Handler
  const handleIncomeDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/estimation/income/${id}`);
      setIncomes(incomes.filter(income => income._id !== id));
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete income');
    }
  };

  // Expense Delete Handler
  const handleExpenseDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/estimation/expense/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  // Handler for opening form modal for add
  const handleAdd = (type) => {
    setFormMode('add');
    setFormType(type);
    setCurrentRecord(null);
    setShowForm(true);
  };

  // Handler for opening form modal for edit
  const handleEdit = (type, record) => {
    setFormMode('edit');
    setFormType(type);
    setCurrentRecord(record);
    setShowForm(true);
  };

  // Handler for form submit (add or edit)
  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === 'add') {
        if (formType === 'income') {
          const { data } = await axios.post(`${API_URL}/api/estimation/income`, formData);
          setIncomes([...incomes, data]);
        } else if (formType === 'expense') {
          const { data } = await axios.post(`${API_URL}/api/estimation/expense`, formData);
          setExpenses([...expenses, data]);
        }
      } else if (formMode === 'edit') {
        if (formType === 'income') {
          const { data } = await axios.put(`${API_URL}/api/estimation/income/${currentRecord._id}`, formData);
          setIncomes(incomes.map(income => income._id === currentRecord._id ? data : income));
        } else if (formType === 'expense') {
          const { data } = await axios.put(`${API_URL}/api/estimation/expense/${currentRecord._id}`, formData);
          setExpenses(expenses.map(expense => expense._id === currentRecord._id ? data : expense));
        }
      }
      setShowForm(false);
      fetchData(); // Refresh stats and data
    } catch (error) {
      toast.error('Failed to submit form');
    }
  };

  // Sorting handlers for income and expense
  const toggleIncomeSort = () => {
    setIncomeFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleExpenseSort = () => {
    setExpenseFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (!['developer', 'financier'].includes(user?.role)) {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
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
        </div>
      </div>

      {/* Render Content Based on Active Tab */}
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
              <option value="">Status</option>
              <option value="paid">Paid</option>
              <option value="not paid">Not Paid</option>
            </select>
            <select
              value={incomeFilters.belongsTo}
              onChange={(e) => setIncomeFilters({ ...incomeFilters, belongsTo: e.target.value })}
              className="form-select"
            >
              <option value="">Belongs To</option>
              <option value="youth">Youth</option>
              <option value="villagers">Villagers</option>
            </select>
            <select
  value={incomeFilters.sortOrder || ""}
  onChange={(e) => setIncomeFilters({ ...incomeFilters, sortOrder: e.target.value })}
  className="form-select"
>
  <option value="">Sort</option>
  <option value="asc">Ascending</option>
  <option value="desc">Descending</option>
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
              onAdd={() => handleAdd('income')}
              onEdit={(record) => handleEdit('income', record)}
              onDelete={handleIncomeDelete}
            />
          </div>
        </div>
      )}

      {activeTab === 'expense' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
  value={incomeFilters.sortOrder}
  onChange={(e) => setIncomeFilters({ ...incomeFilters, sortOrder: e.target.value })}
  className="form-select"
> <option value="">Sort</option>
  <option value="desc">Descending</option>
  <option value="asc">Ascending</option>
</select>
          </div>

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
              onAdd={() => handleAdd('expense')}
              onEdit={(record) => handleEdit('expense', record)}
              onDelete={handleExpenseDelete}
            />
          </div>
        </div>
      )}

      {/* Modal Form for Add/Edit */}
      {showForm && (
        <EstimationForm
          type={formType}
          mode={formMode}
          data={currentRecord}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default Estimation;
