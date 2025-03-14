import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../utils/config';
import EstimationStats from '../components/estimation/Stats';
import IncomeSection from '../components/estimation/IncomeSection';
import ExpenseSection from '../components/estimation/ExpenseSection';
import EstimationPrint from '../components/estimation/Print';

function Estimation() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({
    totalEstimatedIncome: 0,
    totalEstimatedPaidIncome: 0,
    totalEstimatedNotPaidIncome: 0,
    totalEstimatedExpense: 0,
    balance: 0
  });
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    income: {
      sno: true,
      name: true,
      previousAmount: false,
      presentAmount: true,
      belongsTo: false,
      status: false,
      others: false
    },
    expense: {
      sno: true,
      purpose: true,
      previousAmount: false,
      presentAmount: true,
      others: false
    }
  });

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    } else if (activeTab === 'income') {
      fetchIncomes();
    } else if (activeTab === 'expense') {
      fetchExpenses();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/estimation/stats`);
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    }
  };

  const fetchIncomes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/estimation/income`);
      setIncomes(data);
    } catch (error) {
      toast.error('Failed to fetch incomes');
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/estimation/expense`);
      setExpenses(data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Estimation Management</h1>
        <div className="flex items-center space-x-4">
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
            {user?.role !== 'user' && (
              <>
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
              </>
            )}
          </div>
          <EstimationPrint
            activeTab={activeTab}
            stats={stats}
            incomes={incomes}
            expenses={expenses}
            visibleColumns={visibleColumns[activeTab === 'income' ? 'income' : 'expense']}
          />
        </div>
      </div>

      {activeTab === 'stats' && (
        <EstimationStats stats={stats} />
      )}

      {activeTab === 'income' && user?.role !== 'user' && (
        <IncomeSection 
          refreshStats={fetchStats}
          onColumnsChange={(columns) => setVisibleColumns(prev => ({ ...prev, income: columns }))}
        />
      )}

      {activeTab === 'expense' && user?.role !== 'user' && (
        <ExpenseSection 
          refreshStats={fetchStats}
          onColumnsChange={(columns) => setVisibleColumns(prev => ({ ...prev, expense: columns }))}
        />
      )}
    </div>
  );
}

export default Estimation;