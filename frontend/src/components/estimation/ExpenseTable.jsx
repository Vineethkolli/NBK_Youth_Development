import { useState } from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

function EstimatedExpenseTable({
  expenses,
  visibleColumns,
  isEditing,
  onAdd,
  onUpdate,
  onDelete
}) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (expense, field, value) => {
    setEditingCell({ id: expense._id, field });
    setEditValue(value.toString());
  };

  const handleSave = async (expense) => {
    const value = editingCell.field === 'currentAmount' || editingCell.field === 'previousYearAmount'
      ? Number(editValue)
      : editValue;

    await onUpdate(expense._id, { [editingCell.field]: value });
    setEditingCell(null);
  };

  const handleKeyPress = (e, expense) => {
    if (e.key === 'Enter') {
      handleSave(expense);
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
    {visibleColumns.purpose && (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Purpose
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
    {visibleColumns.contact && (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Contact
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
          {expenses.map((expense, index) => (
            <tr key={expense._id}>
              {visibleColumns.sno && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {index + 1}
                </td>
              )}
              {visibleColumns.purpose && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === expense._id && editingCell?.field === 'purpose' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, expense)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(expense)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(expense, 'purpose', expense.purpose)}
                      className="cursor-pointer"
                    >
                      {expense.purpose}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.previousYearAmount && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === expense._id && editingCell?.field === 'previousYearAmount' ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, expense)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(expense)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(expense, 'previousYearAmount', expense.previousYearAmount)}
                      className="cursor-pointer"
                    >
                      {expense.previousYearAmount}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.currentAmount && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === expense._id && editingCell?.field === 'currentAmount' ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, expense)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(expense)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(expense, 'currentAmount', expense.currentAmount)}
                      className="cursor-pointer"
                    >
                      {expense.currentAmount}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.contact && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === expense._id && editingCell?.field === 'contact' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, expense)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(expense)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(expense, 'contact', expense.contact)}
                      className="cursor-pointer"
                    >
                      {expense.contact}
                    </div>
                  )}
                </td>
              )}
              {visibleColumns.others && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingCell?.id === expense._id && editingCell?.field === 'others' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, expense)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(expense)}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(expense, 'others', expense.others)}
                      className="cursor-pointer"
                    >
                      {expense.others}
                    </div>
                  )}
                </td>
              )}
              {isEditing && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onDelete(expense._id)}
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

export default EstimatedExpenseTable;