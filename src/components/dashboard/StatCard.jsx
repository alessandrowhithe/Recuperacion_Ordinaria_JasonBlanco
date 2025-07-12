// components/dashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      red: 'bg-red-50 border-red-200 text-red-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getIconColorClasses = (color) => {
    const iconColorMap = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      purple: 'text-purple-500',
      red: 'text-red-500'
    };
    return iconColorMap[color] || iconColorMap.blue;
  };

  return (
    <div className={`stat-card p-6 rounded-lg border-2 ${getColorClasses(color)}`}>
      <div className="flex items-center justify-between">
        <div className="stat-info">
          <p className="text-sm font-medium opacity-75 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-white ${getIconColorClasses(color)}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;