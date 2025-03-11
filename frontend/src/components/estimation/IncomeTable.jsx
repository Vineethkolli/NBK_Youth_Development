import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

function IncomeTable({ isEditMode, columns, rows, onAddRow, onUpdateRow, onDeleteRow, onUpdateColumn }) {
  const [editingCell, setEditingCell] = useState({ rowId: null, field: null, value: '' });

  const handleDoubleClick = (rowId, field, currentValue) => {
    setEditingCell({ rowId, field, value: currentValue });
  };

  const handleChange = (e) => {
    setEditingCell({ ...editingCell, value: e.target.value });
  };

  const handleBlur = () => {
    if (editingCell.rowId && editingCell.field) {
      let value = editingCell.value;
      if (['prevAmt', 'currAmt', 'informed'].includes(editingCell.field)) {
        value = Number(value);
      }
      onUpdateRow(editingCell.rowId, { [editingCell.field]: value });
    }
    setEditingCell({ rowId: null, field: null, value: '' });
  };

  const handleCounterIncrement = (rowId, currentValue) => {
    onUpdateRow(rowId, { informed: currentValue + 1 });
  };

  const handleCounterDecrement = (rowId, currentValue) => {
    onUpdateRow(rowId, { informed: currentValue - 1 });
  };

  const handleHeaderEdit = (column) => {
    const newHeader = prompt("Enter new header", column.header);
    if (newHeader) {
      onUpdateColumn(column.id, newHeader);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            {columns.map(col => (
              <th key={col.id} className="p-2 border">
                <div className="flex items-center">
                  <span onDoubleClick={() => isEditMode && handleHeaderEdit(col)} className={isEditMode ? 'cursor-pointer' : ''}>
                    {col.header}
                  </span>
                </div>
              </th>
            ))}
            {isEditMode && <th className="p-2 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="border">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border" onDoubleClick={() => handleDoubleClick(row.id, 'name', row.name)}>
                {editingCell.rowId === row.id && editingCell.field === 'name' ? (
                  <input type="text" value={editingCell.value} onChange={handleChange} onBlur={handleBlur} autoFocus className="border"/>
                ) : (
                  row.name
                )}
              </td>
              <td className="p-2 border" onDoubleClick={() => handleDoubleClick(row.id, 'prevAmt', row.prevAmt)}>
                {editingCell.rowId === row.id && editingCell.field === 'prevAmt' ? (
                  <input type="number" value={editingCell.value} onChange={handleChange} onBlur={handleBlur} autoFocus className="border"/>
                ) : (
                  row.prevAmt
                )}
              </td>
              <td className="p-2 border" onDoubleClick={() => handleDoubleClick(row.id, 'currAmt', row.currAmt)}>
                {editingCell.rowId === row.id && editingCell.field === 'currAmt' ? (
                  <input type="number" value={editingCell.value} onChange={handleChange} onBlur={handleBlur} autoFocus className="border"/>
                ) : (
                  row.currAmt
                )}
              </td>
              <td className="p-2 border" onDoubleClick={() => handleDoubleClick(row.id, 'category', row.category)}>
                {editingCell.rowId === row.id && editingCell.field === 'category' ? (
                  <select value={editingCell.value} onChange={handleChange} onBlur={handleBlur} autoFocus className="border">
                    <option value="youth">Youth</option>
                    <option value="villagers">Villagers</option>
                  </select>
                ) : (
                  row.category
                )}
              </td>
              <td className="p-2 border" onDoubleClick={() => handleDoubleClick(row.id, 'status', row.status)}>
                {editingCell.rowId === row.id && editingCell.field === 'status' ? (
                  <select value={editingCell.value} onChange={handleChange} onBlur={handleBlur} autoFocus className="border">
                    <option value="paid">Paid</option>
                    <option value="not paid">Not Paid</option>
                  </select>
                ) : (
                  row.status
                )}
              </td>
              <td className="p-2 border">
                <div className="flex items-center">
                  <button onClick={() => handleCounterDecrement(row.id, row.informed)} className="px-1">-</button>
                  <span className="px-2">{row.informed}</span>
                  <button onClick={() => handleCounterIncrement(row.id, row.informed)} className="px-1">+</button>
                </div>
              </td>
              <td className="p-2 border" onDoubleClick={() => handleDoubleClick(row.id, 'others', row.others)}>
                {editingCell.rowId === row.id && editingCell.field === 'others' ? (
                  <input type="text" value={editingCell.value} onChange={handleChange} onBlur={handleBlur} autoFocus className="border"/>
                ) : (
                  row.others
                )}
              </td>
              {isEditMode && (
                <td className="p-2 border">
                  <button onClick={() => onDeleteRow(row.id)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td colSpan={isEditMode ? columns.length + 1 : columns.length} className="p-2 border">
              <button onClick={onAddRow} className="flex items-center text-blue-600">
                <Plus size={16} /> Add Row
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default IncomeTable;
