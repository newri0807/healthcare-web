import React from 'react';
import { X } from 'lucide-react';
import type { ModalProps } from '../types';

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  type = 'alert', 
  onConfirm, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* 헤더 */}
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{title}</h3>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>

        {/* 본문 */}
        <div style={bodyStyle}>
          {children}
        </div>

        {/* 푸터 (버튼) */}
        <div style={footerStyle}>
          {type === 'alert' && (
            <button onClick={onClose} style={{ ...btnStyle, background: '#3b82f6', color: 'white' }}>확인</button>
          )}

          {type === 'confirm' && (
            <>
              <button onClick={onClose} style={btnStyle}>취소</button>
              <button onClick={onConfirm} style={{ ...btnStyle, background: '#ef4444', color: 'white' }}>삭제</button>
            </>
          )}

          {type === 'form' && (
            <>
              <button onClick={onClose} style={btnStyle}>취소</button>
              <button onClick={onConfirm} style={{ ...btnStyle, background: '#3b82f6', color: 'white' }}>저장</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Styles (그대로 유지) ---
const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', width: '400px', maxWidth: '90%',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out'
};

const headerStyle: React.CSSProperties = {
  padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc'
};

const bodyStyle: React.CSSProperties = {
  padding: '20px', fontSize: '15px', color: '#475569', lineHeight: '1.6'
};

const footerStyle: React.CSSProperties = {
  padding: '15px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px'
};

const btnStyle: React.CSSProperties = {
  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: '#e2e8f0', color: '#475569'
};

const closeBtnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8'
};