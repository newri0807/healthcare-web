import React from 'react';
import { X } from 'lucide-react';
import type { MediaItem } from '../../types';

interface Props {
  files: MediaItem[];
  onRemove: (id: string) => void;
}

export const MediaGallery: React.FC<Props> = ({ files, onRemove }) => {
  return (
    <div>
      <h4 style={{ margin: '0 0 10px 0', color: '#475569' }}>
        📎 첨부 파일 ({files.length})
      </h4>
      
      {files.length === 0 ? (
        <div style={{ padding: '30px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
          첨부된 사진이나 영상이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {files.map((media) => (
            <div key={media.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', height: '120px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              
              {/* 삭제 버튼 */}
              <button 
                onClick={() => { if(confirm('이 파일을 삭제하시겠습니까?')) onRemove(media.id); }} 
                style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', zIndex: 10 }}
              >
                <X size={12} />
              </button>
              
              {/* 미디어 렌더링 */}
              {media.type === 'image' ? (
                <img 
                  src={media.url} 
                  alt={media.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <video 
                  src={media.url} 
                  controls 
                  style={{ width: '100%', height: '100%', background: 'black' }} 
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};