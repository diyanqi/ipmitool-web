import React from 'react';
import { ChassisStatus as ChassisStatusType } from '@/types/ipmi';

interface ChassisStatusProps {
  chassisStatus: ChassisStatusType;
  isLoading: boolean;
  error?: string;
}

const ChassisStatus: React.FC<ChassisStatusProps> = ({ 
  chassisStatus, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="w-full p-4 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-danger text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!chassisStatus || Object.keys(chassisStatus).length === 0) {
    return (
      <div className="w-full p-4 text-center">
        <p>No chassis status data available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-content1 rounded-lg shadow">
      <div className="p-4 border-b border-default-200">
        <h3 className="text-lg font-medium">Chassis Status</h3>
      </div>
      <div className="p-4">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(chassisStatus).map(([key, value]) => (
            <div key={key} className="border-b border-default-100 pb-2">
              <dt className="text-sm font-medium text-default-500">{key}</dt>
              <dd className="mt-1 text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default ChassisStatus;