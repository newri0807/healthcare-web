import React from 'react';
import { LayoutDashboard, Users, LogOut, Activity } from 'lucide-react';
import type { MenuType } from '../types';


interface SidebarProps {
  currentMenu: MenuType;
  setMenu: (menu: MenuType) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMenu, setMenu, onLogout }) => {
  return (
    <nav className="sidebar">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <Activity color="#3b82f6" size={28} /> MedDash
      </h2>
      
      <div className={`nav-item ${currentMenu === 'dashboard' ? 'active' : ''}`} onClick={() => setMenu('dashboard')}>
        <LayoutDashboard size={20} /> 대시보드
      </div>
      <div className={`nav-item ${currentMenu === 'patients' ? 'active' : ''}`} onClick={() => setMenu('patients')}>
        <Users size={20} /> 환자 관리
      </div>
      
      <div style={{ flex: 1 }}></div>
      
      <div className="nav-item" onClick={onLogout}>
        <LogOut size={20} /> 로그아웃
      </div>
    </nav>
  );
};