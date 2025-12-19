import React, { useState, useRef } from 'react';
import { Save, Trash2, FileSpreadsheet, Image as ImageIcon, Video, Edit3 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { usePatientManager } from '../hooks/usePatientManager';

// 분리한 컴포넌트들 임포트
import { PatientList } from '../components/patient/PatientList';
import { MediaGallery } from '../components/patient/MediaGallery';
import { SurveyForm } from '../components/patient/SurveyForm';

export const PatientCare: React.FC = () => {
  // 1. 커스텀 훅에서 모든 로직과 상태를 가져옴
  const pm = usePatientManager();
  
  // 폼 데이터 관리 (모달용)
  const [formData, setFormData] = useState({ name: '', age: '', diagnosis: '' });
  
  // Refs
  const excelInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // --- 모달 열기 핸들러 ---
  const handleAddClick = () => {
    setFormData({ name: '', age: '', diagnosis: '' });
    pm.openModal({ 
      isOpen: true, type: 'form', title: '신규 환자 등록', 
      action: () => pm.addPatient(formData.name, formData.age, formData.diagnosis) 
    });
  };

  const handleEditClick = () => {
    if(!pm.selectedPatient) return;
    setFormData({ name: pm.selectedPatient.name, age: String(pm.selectedPatient.age), diagnosis: pm.selectedPatient.diagnosis });
    pm.openModal({ 
      isOpen: true, type: 'form', title: '환자 정보 수정', 
      action: () => pm.updatePatientInfo(formData.name, formData.age, formData.diagnosis) 
    });
  };

  const handleDeleteClick = () => {
    pm.openModal({ 
      isOpen: true, type: 'confirm', title: '환자 삭제', 
      content: `[${pm.selectedPatient?.name}] 환자를 삭제하시겠습니까?`, 
      action: pm.deletePatient 
    });
  };

  return (
    <>
      <div className="editor-layout" style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 100px)' }}>
        
        {/* 1. 좌측 리스트 컴포넌트 */}
        <PatientList 
          patients={pm.patients} 
          selectedId={pm.selectedId} 
          onSelect={pm.setSelectedId} 
          onAdd={handleAddClick} 
        />

        {/* 2. 우측 메인 패널 */}
        <div className="edit-panel" style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '25px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', overflowY: 'auto' }}>
          {pm.selectedPatient ? (
            <>
              {/* 툴바 */}
              <div className="toolbar" style={{ display: 'flex', gap: '10px', paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '20px', alignItems: 'center' }}>
                <h3 style={{ margin: 0, marginRight: '10px' }}>{pm.selectedPatient.name} 님의 차트</h3>
                <button onClick={handleEditClick} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><Edit3 size={16} color="#64748b"/></button>
                <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 10px' }}></div>

                <button className="btn-gray" onClick={() => excelInputRef.current?.click()} style={btnStyle}><FileSpreadsheet size={16} color="green" /> 문진표</button>
                <input type="file" ref={excelInputRef} hidden accept=".xlsx,.xls" onChange={pm.handleExcelUpload} />
                
                {/* [핵심] multiple 속성 추가됨 */}
                <button className="btn-gray" onClick={() => imageInputRef.current?.click()} style={btnStyle}><ImageIcon size={16} color="#3b82f6" /> 사진</button>
                <input type="file" ref={imageInputRef} hidden multiple accept="image/*" onChange={(e) => pm.handleMediaUpload(e, 'image')} />

                <button className="btn-gray" onClick={() => videoInputRef.current?.click()} style={btnStyle}><Video size={16} color="#ef4444" /> 영상</button>
                <input type="file" ref={videoInputRef} hidden multiple accept="video/*" onChange={(e) => pm.handleMediaUpload(e, 'video')} />

                <div style={{ flex: 1 }}></div>
                <button onClick={handleDeleteClick} style={{ ...btnStyle, color: '#ef4444', background: '#fef2f2' }}><Trash2 size={16} /> 삭제</button>
                <button onClick={() => pm.openModal({ isOpen: true, type: 'alert', title: '완료', content: '저장되었습니다.' })} style={{ ...btnStyle, background: '#3b82f6', color: 'white' }}><Save size={16} /> 저장</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 3. 문진표 컴포넌트 */}
                <SurveyForm 
                  data={pm.selectedPatient.surveyData} 
                  onAnswer={(qid, ans) => {
                     const newData = pm.selectedPatient!.surveyData.map(s => s.id === qid ? { ...s, answer: ans } : s);
                     pm.updateCurrentPatient({ surveyData: newData });
                  }} 
                />

                {/* 4. 메모 영역 */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>📝 진료 메모</h4>
                  <textarea 
                    value={pm.selectedPatient.notes}
                    onChange={(e) => pm.updateCurrentPatient({ notes: e.target.value })}
                    placeholder="내용 입력..."
                    style={{ width: '100%', minHeight: '100px', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                  />
                </div>

                {/* 5. 미디어 갤러리 컴포넌트 */}
                <MediaGallery 
                  files={pm.selectedPatient.mediaFiles}
                  onRemove={(mid) => {
                     const newFiles = pm.selectedPatient!.mediaFiles.filter(m => m.id !== mid);
                     pm.updateCurrentPatient({ mediaFiles: newFiles });
                  }}
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#cbd5e1' }}>환자를 선택해주세요.</div>
          )}
        </div>
      </div>

      {/* 공통 모달 */}
      <Modal 
        isOpen={pm.modalConfig.isOpen} onClose={pm.closeModal} title={pm.modalConfig.title} 
        type={pm.modalConfig.type} onConfirm={() => { pm.modalConfig.action?.(); pm.closeModal(); }}
      >
        {pm.modalConfig.type === 'form' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="이름" />
            <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} style={inputStyle} placeholder="나이" />
            <input value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} style={inputStyle} placeholder="진단명" />
          </div>
        ) : pm.modalConfig.content}
      </Modal>
    </>
  );
};

const btnStyle: React.CSSProperties = { padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', color: '#475569', fontSize: '13px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' };