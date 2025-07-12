// components/students/StudentTableRow.jsx
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const StudentTableRow = ({ student, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{student.id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{student.Nombre || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
        {student.Carnet || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
        {student.Apellido || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
        {student.Grado || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(student)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(student.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentTableRow;