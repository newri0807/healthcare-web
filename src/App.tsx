import { useState } from 'react';
import './styles/main.css';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import type { MenuType } from './types';
import { PatientCare } from './pages/PatientCare';
import { Sidebar } from './components/Sidebar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<MenuType>('dashboard');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-wrapper">
      <Sidebar 
        currentMenu={currentMenu} 
        setMenu={setCurrentMenu} 
        onLogout={() => setIsLoggedIn(false)} 
      />
      
      <main className="main-area">
        {currentMenu === 'dashboard' && <Dashboard />}
        {currentMenu === 'patients' && <PatientCare />}
        {currentMenu === 'settings' && <div>Settings Page (Coming Soon)</div>}
      </main>
    </div>
  );
}

export default App;