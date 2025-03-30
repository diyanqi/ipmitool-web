import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { executeIpmiCommand } from '@/services/ipmiService';
import { IpmiCommand } from '@/types/ipmi';

const CommandExecutor: React.FC = () => {
  const [selectedCommand, setSelectedCommand] = useState<IpmiCommand>('sensor');
  const [args, setArgs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const allowedCommands: IpmiCommand[] = [
    'sdr', 'sensor', 'chassis', 'power', 'sel', 'user', 'lan', 'fru'
  ];

  const handleExecute = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Parse arguments
      const argsArray = args.trim() ? args.split(' ').filter(Boolean) : undefined;
      
      const response = await executeIpmiCommand(selectedCommand, argsArray);
      
      if (!response.success) {
        setError(response.error || 'Command execution failed');
        return;
      }
      
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    
    if (Array.isArray(result)) {
      return (
        <div className="mt-4 bg-default-50 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-sm whitespace-pre-wrap">
            {result.map((line, index) => {
              if (typeof line === 'string') {
                return <div key={index}>{line}</div>;
              } else {
                return <div key={index}>{JSON.stringify(line, null, 2)}</div>;
              }
            })}
          </pre>
        </div>
      );
    } else {
      return (
        <div className="mt-4 bg-default-50 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      );
    }
  };

  return (
    <div className="w-full overflow-hidden bg-content1 rounded-lg shadow">
      <div className="p-4 border-b border-default-200">
        <h3 className="text-lg font-medium">IPMI Command Executor</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-default-700 mb-1">
              Command
            </label>
            <Listbox
              aria-label="IPMI Commands"
              selectedKeys={[selectedCommand]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as IpmiCommand;
                if (selected) setSelectedCommand(selected);
              }}
            >
              {allowedCommands.map((cmd) => (
                <ListboxItem key={cmd}>
                  {cmd}
                </ListboxItem>
              ))}
            </Listbox>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-default-700 mb-1">
              Arguments (space separated)
            </label>
            <Input
              value={args}
              onChange={(e) => setArgs(e.target.value)}
              placeholder="E.g. status"
              disabled={isLoading}
            />
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-2 bg-danger-100 text-danger-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          <Button
            color="primary"
            onClick={handleExecute}
            isDisabled={isLoading}
          >
            {isLoading ? 'Executing...' : 'Execute Command'}
          </Button>
        </div>
        
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin h-6 w-6 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        )}
        
        {renderResult()}
      </div>
    </div>
  );
};

export default CommandExecutor;