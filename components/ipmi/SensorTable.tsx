import React from 'react';
import { SensorData } from '@/types/ipmi';

interface SensorTableProps {
  sensors: SensorData[];
  isLoading: boolean;
  error?: string;
}

const SensorTable: React.FC<SensorTableProps> = ({ sensors, isLoading, error }) => {
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

  if (!sensors || sensors.length === 0) {
    return (
      <div className="w-full p-4 text-center">
        <p>No sensor data available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-default-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Value</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor, index) => (
            <tr key={index} className="border-b border-default-200">
              <td className="p-2">{sensor.name}</td>
              <td className="p-2">{sensor.value}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(sensor.status)}`}
                >
                  {sensor.status}
                </span>
              </td>
              <td className="p-2">{sensor.details || sensor.raw || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to determine status color
const getStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('ok') || lowerStatus.includes('normal')) {
    return 'bg-success-100 text-success-700';
  } else if (lowerStatus.includes('warning') || lowerStatus.includes('caution')) {
    return 'bg-warning-100 text-warning-700';
  } else if (lowerStatus.includes('critical') || lowerStatus.includes('error')) {
    return 'bg-danger-100 text-danger-700';
  } else {
    return 'bg-default-100 text-default-700';
  }
};

export default SensorTable;