// IPMI related types

export type IpmiCommand = 'sdr' | 'sensor' | 'chassis' | 'power' | 'sel' | 'user' | 'lan' | 'fru' | 'raw';

export type IpmiCommandArgs = string[];

export type IpmiRequest = {
  command: IpmiCommand;
  args?: IpmiCommandArgs;
};

export type IpmiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export type SensorData = {
  name: string;
  value: string;
  status: string;
  details?: string;
  raw?: string;
};

export type ChassisStatus = Record<string, string>;