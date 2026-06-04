import React from 'react';
import BloodTypeBadge from '../../../components/ui/BloodTypeBadge';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { 
  Plus, 
  Minus,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react';

const InventoryControls = ({ 
  bloodTypes = [], 
  selectedBloodType, 
  onSelectType,
  onUpdateInventory,
  onReserveBlood,
  onReleaseBlood,
  loading = false
}) => {
  const handleUpdateSubmit = (e, bloodType) => {
    e.preventDefault();
    // In a real implementation, we'd get values from form inputs
    // For now, we'll simulate with prompt or use default values
    const unitsAvailable = parseInt(prompt(`Enter available units for ${bloodType}:`) || '0');
    const unitsReserved = parseInt(prompt(`Enter reserved units for ${bloodType}:`) || '0');
    
    if (!isNaN(unitsAvailable) && !isNaN(unitsReserved)) {
      onUpdateInventory(bloodType, { unitsAvailable, unitsReserved });
    }
  };

  const handleReserveSubmit = (e, bloodType) => {
    e.preventDefault();
    const units = parseInt(prompt(`Enter units to reserve for ${bloodType}:`) || '1');
    if (!isNaN(units) && units > 0) {
      onReserveBlood(bloodType, units);
    }
  };

  const handleReleaseSubmit = (e, bloodType) => {
    e.preventDefault();
    const units = parseInt(prompt(`Enter units to release for ${bloodType}:`) || '1');
    if (!isNaN(units) && units > 0) {
      onReleaseBlood(bloodType, units);
    }
  };

  return (
    <div className="space-y-6">
      {/* Blood Type Selector */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Blood Type to Manage
        </label>
        <div className="flex flex-wrap gap-3">
          {bloodTypes.map((type) => (
            <Button
              key={type}
              onClick={() => onSelectType(type)}
              active={selectedBloodType === type}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium transition-all"
            >
              <BloodTypeBadge type={type} className="mr-2" />
              <span>{type}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Inventory Management Form */}
      {selectedBloodType && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Manage {selectedBloodType} Inventory
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Available Units */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Available Units
                </label>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      const current = parseInt(prompt(`Current available units for ${selectedBloodType}:`) || '0');
                      const change = parseInt(prompt(`Enter change (positive/negative):`) || '0');
                      if (!isNaN(current) && !isNaN(change)) {
                        onUpdateInventory(selectedBloodType, { 
                          unitsAvailable: Math.max(0, current + change), 
                          unitsReserved: current  // Keep reserved same for now
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Minus className="mr-2" /> Adjust
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      const units = parseInt(prompt(`Set available units for ${selectedBloodType}:`) || '0');
                      if (!isNaN(units) && units >= 0) {
                        // Get current reserved value from state or API - for now preserve current
                        onUpdateInventory(selectedBloodType, { 
                          unitsAvailable: units, 
                          unitsReserved: 0  // This would come from actual state
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="mr-2" /> Set Available
                  </Button>
                </div>
              </div>
              
              {/* Reserved Units */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Reserved Units
                </label>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      const current = parseInt(prompt(`Current reserved units for ${selectedBloodType}:`) || '0');
                      const change = parseInt(prompt(`Enter change (positive/negative):`) || '0');
                      if (!isNaN(current) && !isNaN(change)) {
                        onUpdateInventory(selectedBloodType, { 
                          unitsAvailable: current,  // Keep available same for now
                          unitsReserved: Math.max(0, current + change)
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Minus className="mr-2" /> Adjust
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      const units = parseInt(prompt(`Set reserved units for ${selectedBloodType}:`) || '0');
                      if (!isNaN(units) && units >= 0) {
                        onUpdateInventory(selectedBloodType, { 
                          unitsAvailable: 0,  // This would come from actual state
                          unitsReserved: units
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="mr-2" /> Set Reserved
                  </Button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Quick Actions
                </label>
                <div className="space-y-2">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      const units = parseInt(prompt(`Enter units to reserve for ${selectedBloodType}:`) || '1');
                      if (!isNaN(units) && units > 0) {
                        onReserveBlood(selectedBloodType, units);
                      }
                    }}
                    className="w-full"
                  >
                    <Plus className="mr-2" /> Reserve Units
                  </Button>
                  
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      const units = parseInt(prompt(`Enter units to release for ${selectedBloodType}:`) || '1');
                      if (!isNaN(units) && units > 0) {
                        onReleaseBlood(selectedBloodType, units);
                      }
                    }}
                    className="w-full"
                  >
                    <Minus className="mr-2" /> Release Units
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryControls;
