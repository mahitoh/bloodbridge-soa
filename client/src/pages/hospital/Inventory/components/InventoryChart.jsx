import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import SkeletonLoader from '../../../../components/ui/SkeletonLoader';

const InventoryChart = ({ 
  data = [], 
  loading = false 
}) => {
  if (loading && data.length === 0) {
    return (
      <div className="h-96">
        <div className="flex flex-col items-center justify-center h-full">
          {[...Array(4)].map((_, index) => (
            <SkeletonLoader key={index} height={20} className="w-3/4" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No inventory data available for chart</p>
      </div>
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} />
          <YAxis tickLine={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar 
            dataKey="available" 
            fill="#ef4444" 
            name="Available Units"
            barSize={20}
          />
          <Bar 
            dataKey="reserved" 
            fill="#f59e0b" 
            name="Reserved Units"
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryChart;
