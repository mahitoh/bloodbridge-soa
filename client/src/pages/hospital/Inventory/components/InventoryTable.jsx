import React from 'react';
import BloodTypeBadge from '../../../components/ui/BloodTypeBadge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const InventoryTable = ({ 
  data = [], 
  onUpdate, 
  onReserve, 
  onRelease,
  loading = false
}) => {
  if (loading && data.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
          <SkeletonLoader key={index} height={20} className="w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reserved Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <BloodTypeBadge type={item.blood_type} className="mr-2" />
                    <span className="font-medium text-gray-900">{item.blood_type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600 font-medium">{item.units_available}</span>
                    {item.units_available > 0 && (
                      <span className="text-xs text-red-400">units</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-600 font-medium">{item.units_reserved}</span>
                    {item.units_reserved > 0 && (
                      <span className="text-xs text-orange-400">units</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.units_available + item.units_reserved}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <div className="flex space-x-2">
                    {/* Reserve Button */}
                    <Button 
                      onClick={() => onReserve(item.blood_type, 1)}
                      variant="outline"
                      size="xs"
                      disabled={loading}
                      className="text-xs px-2 py-1"
                    >
                      Reserve 1
                    </Button>
                    
                    {/* Release Button */}
                    <Button 
                      onClick={() => onRelease(item.blood_type, 1)}
                      variant="outline"
                      size="xs"
                      disabled={loading || item.units_reserved === 0}
                      className="text-xs px-2 py-1"
                    >
                      Release 1
                    </Button>
                  </div>
                  
                  {/* Update Button */}
                  <Button 
                    onClick={() => onUpdate(item.blood_type, {
                      unitsAvailable: item.units_available,
                      unitsReserved: item.units_reserved
                    })}
                    variant="outline"
                    size="xs"
                    disabled={loading}
                    className="text-xs px-2 py-1"
                  >
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
        <Button 
          onClick={() => {
            // Reserve one unit of each blood type for demo
            data.forEach(item => {
              if (item.units_available > 0) {
                onReserve(item.blood_type, 1);
              }
            });
          }}
          variant="outline"
          disabled={loading}
        >
          Reserve Sample Units
        </Button>
      </div>
    </div>
  );
};

export default InventoryTable;
