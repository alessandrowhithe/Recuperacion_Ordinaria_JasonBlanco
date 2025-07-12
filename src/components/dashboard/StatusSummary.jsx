// components/dashboard/StatusSummary.jsx
import React from 'react';

const StatusSummary = ({ stats }) => {
  const activePercentage = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
  const inactivePercentage = stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0;

  return (
    <div className="white-card">
      <h3 className="card-title mb-4">Resumen por Estado</h3>
      <div className="space-y-4">
        {/* Estudiantes Activos */}
        <div className="status-item">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-700">Estudiantes Activos</span>
            <span className="text-sm font-bold text-green-800">
              {stats.active} ({activePercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${activePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Estudiantes Inactivos */}
        <div className="status-item">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-red-700">Estudiantes Inactivos</span>
            <span className="text-sm font-bold text-red-800">
              {stats.inactive} ({inactivePercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${inactivePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Resumen total */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total de Estudiantes</span>
            <span className="text-lg font-bold text-gray-900">{stats.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSummary;