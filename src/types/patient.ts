export interface SurveyItem {
  id: number;
  question: string;
  answer: string | null;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  notes: string;
  status: 'Stable' | 'Critical' | 'Recovering';
  surveyData: SurveyItem[];
  mediaFiles: MediaItem[];
}