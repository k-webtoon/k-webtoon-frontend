import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../AdminSidebar';

const Settings: FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">시스템 설정</h2>
      <Outlet />
    </div>
  );
};

export default Settings;

