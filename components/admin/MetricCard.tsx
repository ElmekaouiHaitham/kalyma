import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
        {icon && <div className="text-blue-400 opacity-80">{icon}</div>}
      </div>
      
      <div className="mt-auto">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        
        {(description || trend) && (
          <div className="mt-2 flex items-center text-sm">
            {trend && (
              <span className={`font-semibold mr-2 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description && <span className="text-gray-500">{description}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};
