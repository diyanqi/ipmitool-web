import { Card, CardBody } from "@heroui/card";
import DefaultLayout from "@/layouts/default";

export default function AboutPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center mb-5">
          <h1 className="text-4xl font-bold">About IPMI Web Tool</h1>
          <p className="text-xl mt-4 text-default-600">
            A modern web interface for managing servers through IPMI
          </p>
        </div>

        <Card className="max-w-4xl">
          <CardBody>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">What is IPMI?</h2>
                <p>
                  Intelligent Platform Management Interface (IPMI) is a standardized computer system interface used by system administrators for out-of-band management of computer systems and monitoring of their operation. It allows for managing a computer that may be powered off or otherwise unresponsive by using a network connection to the hardware rather than to an operating system.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">Features</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Monitor server sensor data (temperature, voltage, fan speeds, etc.)</li>
                  <li>View and manage chassis status information</li>
                  <li>Control server power (on, off, reset, cycle)</li>
                  <li>Execute custom IPMI commands through a user-friendly interface</li>
                  <li>Real-time data updates</li>
                  <li>Responsive design that works on desktop and mobile devices</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">Technology Stack</h2>
                <p>
                  This application is built using modern web technologies:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>React for the user interface</li>
                  <li>Next.js for server-side rendering and API routes</li>
                  <li>HeroUI (formerly NextUI) for UI components</li>
                  <li>Tailwind CSS for styling</li>
                  <li>TypeScript for type safety</li>
                  <li>Node.js with child_process for executing ipmitool commands</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
                <p>
                  To use this tool, you need:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>A server with IPMI capability</li>
                  <li>ipmitool installed on the system running this web application</li>
                  <li>Proper network configuration to access the IPMI interface</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
)};
