import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SurveyItem } from '../../types';

const SURVEY_OPTIONS = ['매우 동의', '동의', '중간', '약간 아니요', '매우 아니요'];
const ITEMS_PER_PAGE = 5;

interface Props {
  data: SurveyItem[];
  onAnswer: (id: number, answer: string) => void;
}

export const SurveyForm: React.FC<Props> = ({ data, onAnswer }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!data || data.length === 0) return null;

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
      <div style={{ padding: '12px 15px', background: '#f1f5f9', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>
        📋 건강 문진표 ({data.length}문항)
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={thStyle}>질문</th>
            {SURVEY_OPTIONS.map(opt => (
              <th key={opt} style={{ ...thStyle, width: '70px', textAlign: 'center' }}>{opt}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
              <td style={{ padding: '12px 15px', color: '#334155' }}>{item.question}</td>
              {SURVEY_OPTIONS.map(option => (
                <td key={option} style={{ textAlign: 'center', background: item.answer === option ? '#e0f2fe' : 'transparent' }}>
                  <input 
                    type="radio" 
                    name={`q-${item.id}`} 
                    checked={item.answer === option}
                    onChange={() => onAnswer(item.id, option)}
                    style={{ cursor: 'pointer', accentColor: '#3b82f6' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div style={{ padding: '10px', background: '#f8fafc', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
          disabled={currentPage === 1} 
          style={pageBtnStyle}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>
          {currentPage} / {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
          disabled={currentPage === totalPages} 
          style={pageBtnStyle}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Styles ---
const thStyle: React.CSSProperties = {
  padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', color: '#475569', fontSize: '12px', whiteSpace: 'nowrap'
};

const pageBtnStyle: React.CSSProperties = {
  padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', 
  cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b'
};