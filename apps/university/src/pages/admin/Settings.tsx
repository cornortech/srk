import { useState } from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { QrCode } from 'lucide-react';
import { QRManagement } from '../../components/admin/qr/QRManagement';

const AdminSettings = () => {
  const [selectedTab, setSelectedTab] = useState('qr-codes');

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage admin settings and configurations</p>
      </div>

      {/* Tabs */}
      <Card className="bg-bgSecondary border border-gray-700">
        <CardBody className="p-0">
          <Tabs
            aria-label="Settings Tabs"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="w-full"
            classNames={{
              tabList: 'gap-0 w-full rounded-none bg-gray-800 p-0 border-b border-gray-700',
              cursor: 'w-full bg-primary',
              tab: 'max-w-fit px-8 h-12 gap-2 relative rounded-none data-[selected=true]:text-primary',
              tabContent: 'group-data-[selected=true]:text-primary text-gray-400',
            }}
          >
            <Tab
              key="qr-codes"
              title={
                <div className="flex items-center space-x-2">
                  <QrCode className="w-4 h-4" />
                  <span>QR Codes</span>
                </div>
              }
              className="w-full p-6"
            >
              <QRManagement />
            </Tab>

            {/* Future tabs can be added here */}
            {/* 
            <Tab
              key="general"
              title={
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>General</span>
                </div>
              }
              className="w-full p-6"
            >
              <div className="text-white">General Settings Coming Soon...</div>
            </Tab>
            */}
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminSettings;
