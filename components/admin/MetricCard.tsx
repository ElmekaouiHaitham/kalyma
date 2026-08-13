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
      className="bg-white border border-[#1a2b5e]/10 p-6 rounded-2xl shadow-[0_8px_30px_rgba(26,43,94,0.06)] flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[#4a5568] font-medium text-sm">{title}</h3>
        {icon && <div className="text-[#c9842f]">{icon}</div>}
      </div>
      
      <div className="mt-auto">
        <span className="text-3xl font-bold text-[#1a2b5e] tracking-tight">{value}</span>
        
        {(description || trend) && (
          <div className="mt-2 flex items-center text-sm">
            {trend && (
              <span className={`font-semibold mr-2 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description && <span className="text-[#4a5568]/80">{description}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};
