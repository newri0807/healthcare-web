import React from 'react';
import { UserPlus } from 'lucide-react';
import type { Patient } from '../../types';

interface Props {
  patients: Patient[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAdd: () => void;
}

export const PatientList: React.FC<Props> = ({ patients, selectedId, onSelect, onAdd }) => (
  <div className="list-panel" style={{ width: '280px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '20px', fontWeight: 'bold', background: '#f8fafc', borderBottom: '1px solid #eee', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>환자 목록</span>
      <button onClick={onAdd} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><UserPlus size={18} color="#3b82f6"/></button>
    </div>
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {patients.map(p => (
        <div 
          key={p.id} onClick={() => onSelect(p.id)}
          style={{ 
            padding: '15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
            background: selectedId === p.id ? '#eff6ff' : 'white',
            borderLeft: selectedId === p.id ? '4px solid #3b82f6' : '4px solid transparent'
          }}
        >
          <div style={{ fontWeight: 600 }}>{p.name} ({p.age})</div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>{p.diagnosis}</div>
        </div>
      ))}
    </div>
  </div>
);