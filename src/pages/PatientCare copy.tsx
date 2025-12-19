import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Save, Trash2, FileSpreadsheet, Image as ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react';

// 타입을 이 파일 내에서 직접 정의 (에러 방지)
interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  notes: string;
  status: 'Stable' | 'Critical' | 'Recovering';
  excelData?: any[]; // 엑셀 데이터를 배열 형태로 저장
}

// 초기 더미 데이터
const initialPatients: Patient[] = [
  { id: 1, name: '김민수', age: 45, diagnosis: '고혈압', notes: '혈압 수치가 안정적임.', status: 'Stable', excelData: [] },
  { id: 2, name: '이영희', age: 32, diagnosis: '당뇨 초기', notes: '식단 조절 필요.', status: 'Recovering', excelData: [] },
];

export const PatientCare: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [selectedId, setSelectedId] = useState<number>(1);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  // Refs (파일 업로드용)
  const excelInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const selectedPatient = patients.find(p => p.id === selectedId);

  // 1. 엑셀 임포트 핸들러 (테이블 데이터로 저장)
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws); // JSON 배열로 변환

      if (selectedPatient) {
        // 기존 환자 데이터에 엑셀 데이터 추가
        setPatients(prev => prev.map(p => 
          p.id === selectedId ? { ...p, excelData: data } : p
        ));
        setCurrentPage(1); // 페이지 초기화
        alert(`엑셀 데이터 ${data.length}건이 성공적으로 로드되었습니다.`);
      }
    };
    reader.readAsBinaryString(file);
    // 같은 파일을 다시 올릴 수 있도록 value 초기화
    e.target.value = '';
  };

  // 2. 미디어(사진/영상) 실제 업로드 핸들러
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatient) return;

    const fileType = file.type.startsWith('image/') ? '이미지' : '동영상';
    const logText = `\n[${fileType} 첨부됨: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`;
    
    updateNotes(selectedPatient.notes + logText);
    alert(`${fileType} 파일이 첨부되었습니다: ${file.name}`);
    
    e.target.value = ''; // 초기화
  };

  // 노트 텍스트 업데이트
  const updateNotes = (newNotes: string) => {
    setPatients(prev => prev.map(p => 
      p.id === selectedId ? { ...p, notes: newNotes } : p
    ));
  };

  // 페이지네이션 계산
  const currentExcelData = selectedPatient?.excelData || [];
  const totalPages = Math.ceil(currentExcelData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = currentExcelData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="editor-layout" style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 100px)' }}>
      {/* 왼쪽: 환자 리스트 */}
      <div className="list-panel" style={{ width: '300px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', fontWeight: 'bold', borderBottom: '1px solid #eee', background: '#f8fafc' }}>환자 리스트</div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {patients.map(p => (
            <div 
              key={p.id} 
              className={`patient-row ${selectedId === p.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(p.id)}
              style={{ 
                padding: '15px', 
                borderBottom: '1px solid #f1f5f9', 
                cursor: 'pointer',
                background: selectedId === p.id ? '#eff6ff' : 'white',
                borderLeft: selectedId === p.id ? '4px solid #3b82f6' : '4px solid transparent'
              }}
            >
              <div style={{ fontWeight: 600 }}>{p.name} ({p.age})</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{p.diagnosis} - <span style={{color: p.status === 'Stable' ? 'green' : 'red'}}>{p.status}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 에디터 및 테이블 영역 */}
      <div className="edit-panel" style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' }}>
        {selectedPatient ? (
          <>
            {/* 툴바 */}
            <div className="toolbar" style={{ display: 'flex', gap: '10px', paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
              <button className="btn btn-gray" onClick={() => excelInputRef.current?.click()} style={btnStyle}>
                <FileSpreadsheet size={16} color="green" /> Excel 가져오기
              </button>
              {/* 실제 파일 input (숨김) */}
              <input type="file" ref={excelInputRef} style={{ display: 'none' }} accept=".xlsx, .xls" onChange={handleExcelUpload} />
              
              <button className="btn btn-gray" onClick={() => mediaInputRef.current?.click()} style={btnStyle}>
                <ImageIcon size={16} /> 미디어 첨부
              </button>
              {/* 미디어 파일 input (숨김) */}
              <input type="file" ref={mediaInputRef} style={{ display: 'none' }} accept="image/*,video/*" onChange={handleMediaUpload} />

              <div style={{ flex: 1 }}></div>
              <button className="btn btn-gray" style={{ ...btnStyle, color: '#ef4444', background: '#fef2f2' }}><Trash2 size={16} /> 삭제</button>
              <button className="btn btn-blue" style={{ ...btnStyle, background: '#3b82f6', color: 'white' }}><Save size={16} /> 저장</button>
            </div>
            
            <h3 style={{ marginTop: 0 }}>{selectedPatient.name} 진료 기록</h3>
            
            {/* 1. 텍스트 에디터 영역 */}
            <textarea 
              className="textarea-editor"
              value={selectedPatient.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="진료 내용을 입력하세요..."
              style={{ 
                width: '100%', minHeight: '150px', marginBottom: '20px', 
                padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                fontSize: '15px', lineHeight: '1.6', resize: 'vertical'
              }}
            />

            {/* 2. 엑셀 데이터 테이블 영역 */}
            {currentExcelData.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: '2px dashed #e2e8f0', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#475569' }}>📊 임포트된 엑셀 데이터</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>총 {currentExcelData.length}건</span>
                </div>
                
                <div style={{ flex: 1, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ background: '#f1f5f9', position: 'sticky', top: 0 }}>
                      <tr>
                        {/* 엑셀의 첫 번째 행 키값을 헤더로 사용 */}
                        {Object.keys(currentItems[0] || {}).map((key) => (
                          <th key={key} style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row: any, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} style={{ padding: '8px 10px', color: '#334155' }}>{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 컨트롤 */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={pageBtnStyle}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>
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
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#ccc' }}>
            환자를 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
};

// 스타일 객체 (코드 깔끔함을 위해 분리)
const btnStyle: React.CSSProperties = {
  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', color: '#475569'
};

const pageBtnStyle: React.CSSProperties = {
  padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', 
  cursor: 'pointer', display: 'flex', alignItems: 'center'
};