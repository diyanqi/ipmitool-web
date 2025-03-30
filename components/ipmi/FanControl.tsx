import React, { useState, useEffect } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { setFanSpeed, getFanInfo } from '@/services/ipmiService';

const FanControl: React.FC = () => {
  const [fanSpeed, setFanSpeedValue] = useState<number>(50);
  const [currentFanInfo, setCurrentFanInfo] = useState<string>('Unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchFanInfo = async () => {
    setIsLoadingInfo(true);
    setError(null);
    
    try {
      const response = await getFanInfo();
      
      if (!response.success) {
        setError(response.error || 'Failed to fetch fan information');
        return;
      }
      
      if (response.data && typeof response.data === 'string') {
        setCurrentFanInfo(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setCurrentFanInfo(JSON.stringify(response.data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoadingInfo(false);
    }
  };

  useEffect(() => {
    fetchFanInfo();
    // 设置定时刷新风扇信息，每30秒刷新一次
    const intervalId = setInterval(fetchFanInfo, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleApplyFanSpeed = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await setFanSpeed(fanSpeed);
      
      if (!response.success) {
        setError(response.error || 'Failed to set fan speed');
        return;
      }
      
      setSuccessMessage(`Fan speed successfully set to ${fanSpeed}%`);
      // 更新风扇信息
      fetchFanInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // 自动清除成功消息
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="w-full overflow-hidden bg-content1 rounded-lg shadow">
      <div className="p-4 border-b border-default-200">
        <h3 className="text-lg font-medium">Fan Control</h3>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-default-500">Current Fan Status</p>
          {isLoadingInfo ? (
            <div className="mt-2 flex items-center">
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary rounded-full border-t-transparent"></div>
              <span className="text-sm">Loading fan information...</span>
            </div>
          ) : (
            <p className="mt-1 text-sm break-words">{currentFanInfo}</p>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-danger-100 text-danger-700 rounded">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-2 bg-success-100 text-success-700 rounded">
            {successMessage}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-default-700 mb-1">
            Fan Speed: {fanSpeed}%
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs">0%</span>
            <Input
              type="range"
              min="0"
              max="100"
              step="1"
              value={fanSpeed.toString()}
              onChange={(e) => setFanSpeedValue(parseInt(e.target.value, 10))}
              className="flex-grow"
            />
            <span className="text-xs">100%</span>
          </div>
          <p className="mt-1 text-xs text-default-400">
            Sets fan speed from 0% (minimum) to 100% (maximum)
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button
            color="primary"
            isDisabled={isLoading}
            onClick={handleApplyFanSpeed}
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></span>
                Applying...
              </>
            ) : (
              'Apply Fan Speed'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FanControl;