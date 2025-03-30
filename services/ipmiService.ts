// Service for handling IPMI API calls
import { IpmiCommand, IpmiCommandArgs, IpmiRequest, IpmiResponse } from '@/types/ipmi';

export const executeIpmiCommand = async (
  command: IpmiCommand,
  args?: IpmiCommandArgs
): Promise<IpmiResponse> => {
  try {
    const response = await fetch('/api/ipmitool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command, args } as IpmiRequest),
    });

    const data = await response.json();
    return data as IpmiResponse;
  } catch (error) {
    console.error('Error executing IPMI command:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Helper functions for common IPMI commands
export const getSensorData = () => executeIpmiCommand('sensor');
export const getChassisStatus = () => executeIpmiCommand('chassis', ['status']);
export const getPowerStatus = () => executeIpmiCommand('power', ['status']);
export const setPowerOn = () => executeIpmiCommand('power', ['on']);
export const setPowerOff = () => executeIpmiCommand('power', ['off']);
export const setPowerCycle = () => executeIpmiCommand('power', ['cycle']);
export const setPowerReset = () => executeIpmiCommand('power', ['reset']);
export const getSELInfo = () => executeIpmiCommand('sel', ['info']);
export const getSELList = () => executeIpmiCommand('sel', ['list']);
export const getFruList = () => executeIpmiCommand('fru', ['list']);
export const getLanInfo = () => executeIpmiCommand('lan', ['print']);

// Fan control functions
export const setFanSpeed = (fanSpeed: number) => {
  // 将 0-100 映射到 0-96 (0x00 到 0x60)
  const mappedFanSpeed = Math.round(fanSpeed * (0x60 / 100));
  // 转换为十六进制并确保两位数
  const hexSpeed = mappedFanSpeed.toString(16).padStart(2, '0');
  
  return executeIpmiCommand('raw', ['0x30', '0x30', '0x02', '0xff', `0x${hexSpeed}`]);
};

export const getFanInfo = () => executeIpmiCommand('sensor', ['get', 'FAN1']);