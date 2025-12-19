import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 style={{ marginBottom: '30px' }}>Healthcare System</h1>
        <input 
          type="text" 
          placeholder="Admin ID" 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} 
        />
        <button 
          onClick={onLogin}
          style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
        >
          접속하기
        </button>
      </div>
    </div>
  );
};