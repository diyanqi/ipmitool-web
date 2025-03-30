import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Slider } from '@heroui/slider';
import { useTranslation } from 'next-i18next';
import { setFanSpeed, getFanInfo } from '@/services/ipmiService';

const FanControl: React.FC = () => {
  const { t } = useTranslation('common');
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
        setError(response.error || t('fanControl.failedToFetch'));
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
        setError(response.error || t('fanControl.failedToSet'));
        return;
      }
      
      setSuccessMessage(t('fanControl.successMessage', { value: fanSpeed }));
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
        <h3 className="text-lg font-medium">{t('fanControl.title')}</h3>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-default-500">{t('fanControl.currentStatus')}</p>
          {isLoadingInfo ? (
            <div className="mt-2 flex items-center">
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary rounded-full border-t-transparent"></div>
              <span className="text-sm">{t('fanControl.loading')}</span>
            </div>
          ) : currentFanInfo && currentFanInfo !== 'Unknown' ? (
            <p className="mt-1 text-sm break-words">{currentFanInfo}</p>
          ) : (
            <p className="mt-1 text-sm text-default-400">{t('fanControl.noData')}</p>
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
            {t('fanControl.fanSpeed', { value: fanSpeed })}
          </label>
          <Slider
            className="max-w-full"
            color="primary"
            defaultValue={50}
            value={fanSpeed}
            onChange={(value) => {
              // 确保value是number类型
              if (typeof value === 'number') {
                setFanSpeedValue(value);
              }
            }}
            step={10}
            marks={[
              {
                value: 0,
                label: "0%",
              },
              {
                value: 20,
                label: "20%",
              },
              {
                value: 50,
                label: "50%",
              },
              {
                value: 80,
                label: "80%",
              },
              {
                value: 100,
                label: "100%",
              },
            ]}
          />
          <p className="mt-1 text-xs text-default-400">
            {t('fanControl.setsFanSpeed')}
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
                {t('fanControl.applying')}
              </>
            ) : (
              t('fanControl.applyButton')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FanControl;