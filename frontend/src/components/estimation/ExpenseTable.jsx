import { Edit2, Trash2 } from 'lucide-react';

function EstimatedExpenseTable({
  expenses,
  visibleColumns,
  onAdd,
  onEdit,
  onDelete
}) {
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
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
                  {expense.purpose}
                </td>
              )}
              {visibleColumns.previousYearAmount && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {expense.previousYearAmount}
                </td>
              )}
              {visibleColumns.currentAmount && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {expense.currentAmount}
                </td>
              )}
              {visibleColumns.contact && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {expense.contact}
                </td>
              )}
              {visibleColumns.others && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {expense.others}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button onClick={() => onEdit(expense)} className="text-blue-600 hover:text-blue-900">
                  <Edit2 className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(expense._id)} className="text-red-600 hover:text-red-900 ml-2">
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default EstimatedExpenseTable;
