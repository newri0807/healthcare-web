# 🏥 헬스케어 스마트 대시보드 (Healthcare Smart Dashboard)

React와 TypeScript로 구축된 현대적인 **환자 관리 및 통계 대시보드**입니다.
엑셀 데이터를 활용한 문진표 자동 생성, 멀티 미디어(사진/영상) 첨부, 그리고 직관적인 환자 관리 기능을 제공합니다.

## ✨ 주요 기능 (Key Features)

### 1. 📊 종합 대시보드 (Dashboard)

- 병원 운영 현황을 한눈에 볼 수 있는 통계 카드 UI.
- Recharts를 활용한 실시간 데이터 시각화.

### 2. 👨‍⚕️ 환자 관리 시스템 (Patient Care)

- **CRUD 완벽 구현:** 환자 등록, 정보 수정, 삭제 기능.
- **LocalStorage 연동:** 새로고침 해도 데이터가 유지되는 영구 저장소 구현.
- **페이지네이션:** 환자 리스트 및 문진표 항목 자동 페이징 처리.

### 3. 📝 스마트 문진표 (Excel to Survey)

- **엑셀 임포트:** `.xlsx` 파일을 업로드하면 자동으로 문진표 UI로 변환.
- **자동 서식:** 엑셀의 첫 번째 열(A열)을 질문으로 인식하여 5점 척도 설문지 자동 생성.

### 4. 📸 미디어 갤러리 (Media Gallery)

- **다중 업로드:** 사진, 동영상 파일을 한 번에 여러 개 선택하여 업로드 가능 (`multiple` 지원).
- **실시간 미리보기:** 업로드 즉시 썸네일(이미지) 및 플레이어(영상) 제공.
- **Base64 저장:** 서버 없이도 브라우저 내에 미디어 데이터 저장 및 로드.

### 5. 🎨 UI/UX

- **모달(Modal) 시스템:** 알림, 확인, 입력 폼을 통합된 재사용 가능한 모달 컴포넌트로 관리.
- **반응형 사이드바:** 직관적인 네비게이션 메뉴 구조.

---

## 🛠 기술 스택 (Tech Stack)

| 구분           | 기술                                                                                                     | 설명                      |
| :------------- | :------------------------------------------------------------------------------------------------------- | :------------------------ |
| **Framework**  | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)               | UI 라이브러리             |
| **Language**   | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 정적 타입 지원            |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                   | 초고속 빌드 툴            |
| **Styling**    | CSS3                                                                                                     | Custom CSS Variables 활용 |
| **Libraries**  | `xlsx`                                                                                                   | 엑셀 파일 파싱            |
|                | `lucide-react`                                                                                           | 아이콘 팩                 |
|                | `recharts`                                                                                               | 데이터 시각화 (차트)      |

---

## 🗂 프로젝트 구조 (Project Structure)

```bash
health-dashboard-ts/
├── public/                  # 정적 리소스
├── src/
│   ├── components/          # UI 컴포넌트 모음
│   │   ├── patient/         # [기능] 환자 관리 하위 컴포넌트
│   │   │   ├── MediaGallery.tsx  # 미디어 갤러리
│   │   │   ├── PatientList.tsx   # 좌측 환자 목록
│   │   │   └── SurveyForm.tsx    # 문진표 테이블
│   │   ├── Modal.tsx        # 공통 팝업 (Alert/Confirm/Form)
│   │   ├── Sidebar.tsx      # 좌측 네비게이션
│   │   ├── StatCard.tsx     # 대시보드 통계 카드
│   │   └── Layout.tsx       # 전체 레이아웃
│   ├── hooks/               # 커스텀 훅 (비즈니스 로직)
│   │   └── usePatientManager.ts  # 환자 CRUD 로직 분리
│   ├── pages/               # 메인 페이지
│   │   ├── Login.tsx        # 로그인 화면
│   │   ├── Dashboard.tsx    # [UI] 통계/알람 대시보드
│   │   └── PatientCare.tsx  # [기능] 엑셀/CRUD/미디어 메인
│   ├── types/               # [TS] 데이터 인터페이스 정의
│   │   ├── index.ts         # 타입 허브 (Export Barrel)
│   │   ├── patient.ts       # 환자/문진 데이터 타입
│   │   ├── dashboard.ts     # 차트 데이터 타입
│   │   └── ui.ts            # 모달/메뉴 타입
│   ├── styles/
│   │   └── main.css         # 전체 스타일
│   ├── App.tsx              # 라우팅 설정
│   └── main.tsx             # 앱 진입점
├── index.html
├── package.json
└── tsconfig.json
```
