import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BloodTypeBadge from '../../components/ui/BloodTypeBadge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { 
  Drop, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
  Activity
} from 'lucide-react';
import { hospitalAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import InventoryTable from './InventoryTable';
import InventoryControls from './InventoryControls';
import InventoryChart from './InventoryChart';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const HospitalInventory = () => {
  const { user } = useAuth();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await hospitalAPI.get(`/hospitals/${user.id}/inventory`);
        setInventoryData(response.data.inventory || []);
        
        // Prepare chart data
        const chartData = response.data.inventory?.map(item => ({
          name: item.blood_type,
          available: item.units_available,
          reserved: item.units_reserved,
          total: item.units_available + item.units_reserved
        })) || [];
        setChartData(chartData);
      } catch (err) {
        console.error('Failed to fetch blood inventory:', err);
        setError('Failed to load blood inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user?.id]);

  const handleUpdateInventory = async (bloodType, { unitsAvailable, unitsReserved }) => {
    setLoading(true);
    try {
      await hospitalAPI.put(`/hospitals/${user.id}/inventory/${bloodType}`, {
        unitsAvailable,
        unitsReserved
      });
      // Refetch inventory after update
      const response = await hospitalAPI.get(`/hospitals/${user.id}/inventory`);
      setInventoryData(response.data.inventory || []);
      
      // Update chart data
      const newChartData = response.data.inventory?.map(item => ({
        name: item.blood_type,
        available: item.units_available,
        reserved: item.units_reserved,
        total: item.units_available + item.units_reserved
      })) || [];
      setChartData(newChartData);
    } catch (err) {
      console.error('Failed to update inventory:', err);
      setError('Failed to update inventory levels');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleReserveBlood = async (bloodType, units) => {
    setLoading(true);
    try {
      await hospitalAPI.post(`/hospitals/${user.id}/inventory/${bloodType}/reserve`, { units });
      // Refetch inventory after reservation
      const response = await hospitalAPI.get(`/hospitals/${user.id}/inventory`);
      setInventoryData(response.data.inventory || []);
      
      // Update chart data
      const newChartData = response.data.inventory?.map(item => ({
        name: item.blood_type,
        available: item.units_available,
        reserved: item.units_reserved,
        total: item.units_available + item.units_reserved
      })) || [];
      setChartData(newChartData);
    } catch (err) {
      console.error('Failed to reserve blood:', err);
      setError(err.response?.data?.error || 'Failed to reserve blood units');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseBlood = async (bloodType, units) => {
    setLoading(true);
    try {
      await hospitalAPI.post(`/hospitals/${user.id}/inventory/${bloodType}/release`, { units });
      // Refetch inventory after release
      const response = await hospitalAPI.get(`/hospitals/${user.id}/inventory`);
      setInventoryData(response.data.inventory || []);
      
      // Update chart data
      const newChartData = response.data.inventory?.map(item => ({
        name: item.blood_type,
        available: item.units_available,
        reserved: item.units_reserved,
        total: item.units_available + item.units_reserved
      })) || [];
      setChartData(newChartData);
    } catch (err) {
      console.error('Failed to release blood:', err);
      setError(err.response?.data?.error || 'Failed to release blood units');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (loading && inventoryData.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Loader2 size={48} className="mb-4 text-primary-red" />
          <h3 className="text-xl font-bold text-gray-900">Loading Blood Inventory...</h3>
          <p className="text-gray-500">Fetching current blood stock levels</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mb-4 text-critical" />
          <h3 className="text-xl font-bold text-gray-900">Error Loading Inventory</h3>
          <p className="text-gray-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-6"
          >
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const totalAvailable = inventoryData.reduce((sum, item) => sum + item.units_available, 0);
  const totalReserved = inventoryData.reduce((sum, item) => sum + item.units_reserved, 0);
  const totalUnits = totalAvailable + totalReserved;

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl">Blood Inventory Management</h1>
          <p className="text-gray-500">
            Manage your hospital's blood stock levels and reservations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            <RefreshCw size={20} /> Refresh
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="Total Units Available" 
          value={totalAvailable} 
          icon={Drop} 
          color="red"
          trend={totalAvailable > 0 ? `+${totalAvailable}` : '0'}
        />
        <StatCard 
          label="Units Reserved" 
          value={totalReserved} 
          icon={Activity} 
          color="orange"
          trend={totalReserved > 0 ? `+${totalReserved}` : '0'}
        />
        <StatCard 
          label="Total Inventory" 
          value={totalUnits} 
          icon={Activity} 
          color="blue"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Table */}
        <div className="col-span-1">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Current Blood Stock Levels</h3>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setSelectedBloodType(null)}
                  variant="outline"
                  size="sm"
                >
                  Clear Filter
                </Button>
                <Button 
                  onClick={() => {
                    // Add mock data for demonstration
                    const updated = [...inventoryData];
                    const randomIdx = Math.floor(Math.random() * updated.length);
                    updated[randomIdx].units_available += 1;
                    setInventoryData(updated);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Simulate Donation
                </Button>
              </div>
            </div>
            
            {selectedBloodType ? (
              <div className="space-y-4">
                <BloodTypeBadge 
                  type={selectedBloodType} 
                  className="mb-2"
                />
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedBloodType} Inventory Details
                </h3>
                <InventoryTable 
                  data={inventoryData.filter(item => item.blood_type === selectedBloodType)}
                  onUpdate={handleUpdateInventory}
                  onReserve={handleReserveBlood}
                  onRelease={handleReleaseBlood}
                  loading={loading}
                />
              </div>
            ) : (
              <InventoryTable 
                data={inventoryData}
                onUpdate={handleUpdateInventory}
                onReserve={handleReserveBlood}
                onRelease={handleReleaseBlood}
                loading={loading}
              />
            )}
          </div>
        </div>

        {/* Inventory Chart and Controls */}
        <div className="space-y-6">
          <InventoryChart 
            data={chartData} 
            loading={loading}
          />
          <InventoryControls 
            bloodTypes={bloodTypes}
            selectedBloodType={selectedBloodType}
            onSelectType={setSelectedBloodType}
            onUpdateInventory={handleUpdateInventory}
            onReserveBlood={handleReserveBlood}
            onReleaseBlood={handleReleaseBlood}
            loading={loading}
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recent Inventory Activity</h3>
          <Button 
            variant="outline"
            size="sm"
          >
            View Full History
          </Button>
        </div>
        <div className="space-y-4">
          {/* Mock activity items - in real app this would come from API */}
          <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-light text-primary-red">
              <Drop size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                Received 2 units of O+ blood from donation
              </p>
              <p className="text-xs text-gray-500">
                2 hours ago • Donor: Jane Smith (ID: DON-789)
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-warning-light text-warning">
              <AlertTriangle size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                Reserved 3 units of A- blood for surgery
              </p>
              <p className="text-xs text-gray-500">
                4 hours ago • Surgery: Appendectomy • Patient: John Doe
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-success-light text-success">
              <CheckCircle size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                Released 1 unit of B+ blood (expired reservation)
              </p>
              <p className="text-xs text-gray-500">
                6 hours ago • Auto-released after 24h window
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalInventory;
