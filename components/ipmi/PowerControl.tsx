import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { useTranslation } from 'next-i18next';
import { setPowerOn, setPowerOff, setPowerCycle, setPowerReset } from '@/services/ipmiService';

interface PowerControlProps {
  currentStatus: string;
  onStatusChange: () => void;
}

const PowerControl: React.FC<PowerControlProps> = ({ currentStatus, onStatusChange }) => {
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPowerOn = currentStatus.toLowerCase().includes('on');

  const handlePowerAction = async (action: () => Promise<any>, actionName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await action();
      
      if (!response.success) {
        setError(response.error || t('powerControl.failedAction', { action: actionName }));
        return;
      }
      
      // Refresh the status after action
      onStatusChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('fanControl.unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-content1 rounded-lg shadow">
      <div className="p-4 border-b border-default-200">
        <h3 className="text-lg font-medium">{t('powerControl.title')}</h3>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-default-500">{t('powerControl.currentStatus')}</p>
          <p className="mt-1 text-sm">
            <span 
              className={`px-2 py-1 rounded-full ${isPowerOn ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}
            >
              {currentStatus}
            </span>
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-danger-100 text-danger-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            color="success" 
            variant="flat" 
            isDisabled={isLoading || isPowerOn}
            onClick={() => handlePowerAction(setPowerOn, 'power on')}
          >
            {t('powerControl.powerOn')}
          </Button>
          
          <Button 
            color="danger" 
            variant="flat" 
            isDisabled={isLoading || !isPowerOn}
            onClick={() => handlePowerAction(setPowerOff, 'power off')}
          >
            {t('powerControl.powerOff')}
          </Button>
          
          <Button 
            color="warning" 
            variant="flat" 
            isDisabled={isLoading || !isPowerOn}
            onClick={() => handlePowerAction(setPowerCycle, 'power cycle')}
          >
            {t('powerControl.powerCycle')}
          </Button>
          
          <Button 
            color="primary" 
            variant="flat" 
            isDisabled={isLoading || !isPowerOn}
            onClick={() => handlePowerAction(setPowerReset, 'reset')}
          >
            {t('powerControl.reset')}
          </Button>
        </div>
        
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin h-6 w-6 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerControl;