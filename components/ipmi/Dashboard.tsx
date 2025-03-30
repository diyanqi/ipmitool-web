import React, { useState, useEffect } from 'react';
import SensorTable from './SensorTable';
import ChassisStatus from './ChassisStatus';
import PowerControl from './PowerControl';
import CommandExecutor from './CommandExecutor';
import FanControl from './FanControl';
import { getChassisStatus } from '@/services/ipmiService';

const Dashboard: React.FC = () => {
  const [chassisStatus, setChassisStatus] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChassisStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getChassisStatus();
      
      if (!response.success) {
        setError(response.error || 'Failed to fetch chassis status');
        return;
      }
      
      setChassisStatus(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChassisStatus();
  }, []);

  const powerStatus = chassisStatus['System Power'] || 'Unknown';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">IPMI Management Dashboard</h1>
      
      {error && (
        <div className="mb-8 p-4 bg-danger-100 text-danger-700 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ChassisStatus chassisStatus={chassisStatus} isLoading={isLoading} />
        <PowerControl 
          currentStatus={powerStatus} 
          onStatusChange={fetchChassisStatus} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <FanControl />
        <SensorTable 
          sensors={[]} 
          isLoading={isLoading}
        />
      </div>
      
      <div className="mb-8">
        <CommandExecutor />
      </div>
    </div>
  );
};

export default Dashboard;