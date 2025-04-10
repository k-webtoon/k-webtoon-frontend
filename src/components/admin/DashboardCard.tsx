import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  description?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 bg-white rounded-lg shadow-sm ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
    >
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-700">{value.toLocaleString()}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}; 