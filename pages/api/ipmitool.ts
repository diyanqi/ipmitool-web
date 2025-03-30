// API route for executing ipmitool commands
import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

type IpmiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IpmiResponse>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { command, args } = req.body;

    // Validate input
    if (!command) {
      return res.status(400).json({ success: false, error: "Command is required" });
    }

    // Security check - only allow specific ipmitool commands
    const allowedCommands = ["sdr", "sensor", "chassis", "power", "sel", "user", "lan", "fru", "raw"];
    if (!allowedCommands.includes(command)) {
      return res.status(403).json({ 
        success: false, 
        error: `Command not allowed. Allowed commands: ${allowedCommands.join(", ")}` 
      });
    }

    // Get iDRAC configuration from environment variables
    const idracIP = process.env.IDRAC_IP;
    const username = process.env.IDRAC_USERNAME;
    const password = process.env.IDRAC_PASSWORD;
    
    if (!idracIP || !username || !password) {
      return res.status(500).json({
        success: false,
        error: "iDRAC configuration is missing. Please check environment variables."
      });
    }
    
    // Construct the command with iDRAC connection parameters
    let fullCommand = `ipmitool -I lanplus -H ${idracIP} -U ${username} -P "${password}" ${command}`;
    if (args && Array.isArray(args)) {
      // Filter and sanitize arguments
      const sanitizedArgs = args
        .filter(arg => typeof arg === 'string')
        .map(arg => arg.replace(/[;&|<>]/g, ''));
      
      fullCommand += ` ${sanitizedArgs.join(' ')}`;
    }

    // Execute the command
    exec(fullCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
      }
      
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        return res.status(500).json({ success: false, error: stderr });
      }
      
      // Parse the output based on the command
      let parsedOutput;
      try {
        // Different parsing logic based on command type
        if (command === "sdr" || command === "sensor") {
          parsedOutput = parseIpmiSensorOutput(stdout);
        } else if (command === "chassis" && args?.includes("status")) {
          parsedOutput = parseChassisStatusOutput(stdout);
        } else {
          // Default parsing - just split by lines
          parsedOutput = stdout.trim().split('\n');
        }
        
        return res.status(200).json({ success: true, data: parsedOutput });
      } catch (parseError) {
        console.error(`Error parsing output: ${parseError}`);
        // Return raw output if parsing fails
        return res.status(200).json({ 
          success: true, 
          data: stdout.trim(),
          error: "Could not parse output format" 
        });
      }
    });
  } catch (error) {
    console.error(`Unexpected error: ${error}`);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}

// Helper function to parse sensor output
function parseIpmiSensorOutput(output: string) {
  const lines = output.trim().split('\n');
  return lines.map(line => {
    const parts = line.trim().split('|').map(part => part.trim());
    if (parts.length >= 3) {
      return {
        name: parts[0],
        value: parts[1],
        status: parts[2],
        details: parts.slice(3).join(' ').trim()
      };
    }
    return { raw: line.trim() };
  });
}

// Helper function to parse chassis status output
function parseChassisStatusOutput(output: string) {
  const lines = output.trim().split('\n');
  const result: Record<string, string> = {};
  
  lines.forEach(line => {
    const match = line.match(/^([^:]+)\s*:\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      result[key.trim()] = value.trim();
    }
  });
  
  return result;
}