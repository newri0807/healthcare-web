import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, AlertCircle, Users, TrendingUp } from 'lucide-react';

const mockData = [
  { name: '08:00', value: 45, subValue: 30 },
  { name: '10:00', value: 52, subValue: 45 },
  { name: '12:00', value: 38, subValue: 50 },
  { name: '14:00', value: 65, subValue: 40 },
  { name: '16:00', value: 58, subValue: 60 },
  { name: '18:00', value: 48, subValue: 55 },
];

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <span style={{ color: '#64748b', fontSize: '14px' }}>{title}</span>
      {icon}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: color }}>{value}</div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>병원 운영 현황</h2>
      
      {/* 4개의 통계/알람 카드 */}
      <div className="stats-grid">
        <StatCard title="전체 환자" value="1,284" icon={<Users size={20} color="#64748b"/>} color="#1e293b" />
        <StatCard title="응급 알람" value="3건" icon={<AlertCircle size={20} color="#ef4444"/>} color="#ef4444" />
        <StatCard title="평균 회복률" value="94.2%" icon={<TrendingUp size={20} color="#10b981"/>} color="#10b981" />
        <StatCard title="가동 병상" value="82%" icon={<Activity size={20} color="#3b82f6"/>} color="#3b82f6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* 메인 차트: 화려한 그라데이션 */}
        <div className="chart-container">
          <h3>시간대별 바이탈 모니터링</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}/>
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 서브 차트 */}
        <div className="chart-container">
          <h3>병동별 환자 수</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="subValue" fill="#1e293b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};