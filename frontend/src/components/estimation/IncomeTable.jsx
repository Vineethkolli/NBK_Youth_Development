import { useState } from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

function EstimatedIncomeTable({
  incomes,
  visibleColumns,
  isEditing,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (income, field, value) => {
    setEditingCell({ id: income._id, field });
    setEditValue(value.toString());
  };

  const handleSave = async (income) => {
    const value = editingCell.field === 'currentAmount' || editingCell.field === 'previousYearAmount'
      ? Number(editValue)
      : editValue;

    await onUpdate(income._id, { [editingCell.field]: value });
    setEditingCell(null);
  };

  const handleKeyPress = (e, income) => {
    if (e.key === 'Enter') {
      handleSave(income);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {visibleColumns.sno && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                S.No
              </th>
            )}
            {visibleColumns.name && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
            )}
            {visibleColumns.previousYearAmount && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Previous Year Amount
              </th>
            )}
            {visibleColumns.currentAmount && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Amount
              </th>
            )}
            {visibleColumns.category && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
            )}
            {visibleColumns.status && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            )}
            {visibleColumns.others && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Others
              </th>
            )}
            {isEditing && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incomes.map((income, index) => (
            <tr key={income._id}>
              {visibleColumns.sno && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {index + 1}
                </td>
              )}
              {visibleColumns.name && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === income._id && editingCell?.field === 'name' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, income)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(income)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(income, 'name', income.name)}
                      className="cursor-pointer"
                    >
                      {income.name}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.previousYearAmount && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === income._id && editingCell?.field === 'previousYearAmount' ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, income)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(income)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(income, 'previousYearAmount', income.previousYearAmount)}
                      className="cursor-pointer"
                    >
                      {income.previousYearAmount}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.currentAmount && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === income._id && editingCell?.field === 'currentAmount' ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, income)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(income)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(income, 'currentAmount', income.currentAmount)}
                      className="cursor-pointer"
                    >
                      {income.currentAmount}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.category && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === income._id && editingCell?.field === 'category' ? (
                    <div className="flex items-center">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, income)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      >
                        <option value="youth">Youth</option>
                        <option value="villagers">Villagers</option>
                      </select>
                      <button
                        onClick={() => handleSave(income)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(income, 'category', income.category)}
                      className="cursor-pointer"
                    >
                      {income.category}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.status && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === income._id && editingCell?.field === 'status' ? (
                    <div className="flex items-center">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, income)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      >
                        <option value="paid">Paid</option>
                        <option value="not paid">Not Paid</option>
                      </select>
                      <button
                        onClick={() => handleSave(income)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(income, 'status', income.status)}
                      className="cursor-pointer"
                    >
                      {income.status}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.others && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === income._id && editingCell?.field === 'others' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, income)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(income)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(income, 'others', income.others)}
                      className="cursor-pointer"
                    >
                      {income.others}
                    </div>
                  )}
                </td>
              )}
              {isEditing && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onDelete(income._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Row
        </button>
      </div>
    </div>
  );
}

export default EstimatedIncomeTable;