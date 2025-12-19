import type { ReactNode } from 'react';

// 모달(팝업) 관련
export type ModalType = 'alert' | 'confirm' | 'form';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: ModalType;
  onConfirm?: () => void;
  children?: ReactNode;
}

// 메뉴 네비게이션 관련
export type MenuType = 'dashboard' | 'patients' | 'settings';