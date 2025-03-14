import { useState, useEffect } from 'react';
import { Filter, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import EstimatedIncomeTable from './IncomeTable';
import EstimationForm from './Form';
import IncomePrint from './IncomePrint'; // Import IncomePrint component

function IncomeSection({ refreshStats }) {
  const [incomes, setIncomes] = useState([]);
  const [incomeFilters, setIncomeFilters] = useState({
    status: '',
    belongsTo: '',
    sortField: 'presentAmount',
    sortOrder: ''
  });
  const [incomeColumns, setIncomeColumns] = useState({
    sno: true,
    name: true,
    previousAmount: false,
    presentAmount: true,
    belongsTo: false,
    status: false,
    others: false
  });
  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchIncomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeFilters]);

  const fetchIncomes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/estimation/income`, {
        params: incomeFilters
      });
      setIncomes(data);
    } catch (error) {
      toast.error('Failed to fetch income data');
    }
  };

  const handleIncomeDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this income?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/estimation/income/${id}`);
      setIncomes(incomes.filter(income => income._id !== id));
      if (refreshStats) refreshStats();
    } catch (error) {
      toast.error('Failed to delete income');
    }
  };

  const handleAdd = () => {
    setFormMode('add');
    setCurrentRecord(null);
    setShowForm(true);
  };

  const handleEdit = (record) => {
    setFormMode('edit');
    setCurrentRecord(record);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === 'add') {
        const { data } = await axios.post(`${API_URL}/api/estimation/income`, formData);
        // Prepend the new income so it appears on top
        setIncomes([data, ...incomes]);
      } else if (formMode === 'edit') {
        const { data } = await axios.put(`${API_URL}/api/estimation/income/${currentRecord._id}`, formData);
        setIncomes(incomes.map(income => income._id === currentRecord._id ? data : income));
      }
      setShowForm(false);
      fetchIncomes();
      if (refreshStats) refreshStats();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit form');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Add New & Print */}
      <div className="flex justify-end items-center space-x-4 mb-4">
  <button onClick={handleAdd} className="btn-secondary flex items-center space-x-2">
    <Plus className="h-4 w-4" />
    <span>Add New</span>
  </button>
  <IncomePrint 
    incomes={incomes} 
    visibleColumns={incomeColumns} 
    incomeFilters={incomeFilters} 
  />
</div>

      
      {/* Filters Row */}
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={incomeFilters.sortOrder}
          onChange={(e) => setIncomeFilters({ ...incomeFilters, sortOrder: e.target.value })}
          className="form-select"
        >
          <option value="">Sort</option>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
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
          value={incomeFilters.status}
          onChange={(e) => setIncomeFilters({ ...incomeFilters, status: e.target.value })}
          className="form-select"
        >
          <option value="">Status</option>
          <option value="paid">Paid</option>
          <option value="not paid">Not Paid</option>
        </select>
      </div>
      
      {/* Table and Visible Columns */}
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
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleIncomeDelete}
        />
      </div>

      {showForm && (
        <EstimationForm
          type="income"
          mode={formMode}
          data={currentRecord}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default IncomeSection;
