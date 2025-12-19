// src/hooks/usePatientManager.ts
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import type { Patient, SurveyItem, MediaItem, ModalType  } from '../types';

const initialPatients: Patient[] = [
  { id: 1, name: '김민수', age: 45, diagnosis: '고혈압', notes: '혈압 수치가 안정적임.', status: 'Stable', surveyData: [], mediaFiles: [] }
];

export const usePatientManager = () => {
  // --- State ---
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('healthcare_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });
  const [selectedId, setSelectedId] = useState<number | null>(patients[0]?.id || null);
  
  // 모달 상태
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean; type: ModalType; title: string; content?: React.ReactNode; action?: () => void;
  }>({ isOpen: false, type: 'alert', title: '' });

  const selectedPatient = patients.find(p => p.id === selectedId);

  // --- Actions ---
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const openModal = (config: typeof modalConfig) => setModalConfig(config);

  // 1. 환자 CRUD
  const addPatient = (name: string, age: string, diagnosis: string) => {
    const newPatient: Patient = {
      id: Date.now(), name, age: Number(age), diagnosis: diagnosis || '미진단',
      notes: '', status: 'Stable', surveyData: [], mediaFiles: []
    };
    updatePatients([...patients, newPatient]);
    setSelectedId(newPatient.id);
  };

  const updatePatientInfo = (name: string, age: string, diagnosis: string) => {
    if (!selectedId) return;
    updatePatients(patients.map(p => p.id === selectedId ? { ...p, name, age: Number(age), diagnosis } : p));
  };

  const deletePatient = () => {
    if (!selectedId) return;
    const filtered = patients.filter(p => p.id !== selectedId);
    updatePatients(filtered);
    setSelectedId(filtered[0]?.id || null);
  };

  // 2. 데이터 업데이트 공통 함수 (LocalStorage 저장 포함)
  const updatePatients = (newPatients: Patient[]) => {
    setPatients(newPatients);
    try {
      localStorage.setItem('healthcare_patients', JSON.stringify(newPatients));
    } catch (e) {
      alert('저장 공간 부족! 미디어 파일을 줄여주세요.');
    }
  };

  const updateCurrentPatient = (updates: Partial<Patient>) => {
    if (!selectedId) return;
    updatePatients(patients.map(p => p.id === selectedId ? { ...p, ...updates } : p));
  };

  // 3. 엑셀 업로드
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatient) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      
      const newSurveyData = rawData.filter(row => row[0]).map((row, index) => ({
        id: index, question: String(row[0]), answer: null
      }));

      updateCurrentPatient({ surveyData: newSurveyData });
      openModal({ isOpen: true, type: 'alert', title: '성공', content: `${newSurveyData.length}문항이 등록되었습니다.` });
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // 4. [핵심] 미디어 다중 업로드 (Multi-Upload)
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (!e.target.files || !selectedPatient) return;
    
    // FileList를 배열로 변환
    const files = Array.from(e.target.files);
    
    // 비동기로 모든 파일을 읽어서 Base64로 변환
    const filePromises = files.map(file => {
      return new Promise<MediaItem>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random().toString(), // 고유 ID 생성
            type,
            url: reader.result as string,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    // 모든 파일 처리가 끝나면 상태 업데이트
    const newMediaItems = await Promise.all(filePromises);
    updateCurrentPatient({ mediaFiles: [...selectedPatient.mediaFiles, ...newMediaItems] });
    
    e.target.value = ''; 
  };

  return {
    patients, selectedId, setSelectedId, selectedPatient,
    modalConfig, closeModal, openModal,
    addPatient, updatePatientInfo, deletePatient,
    updateCurrentPatient, handleExcelUpload, handleMediaUpload
  };
};