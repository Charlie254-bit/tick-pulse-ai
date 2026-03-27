import React from 'react';
import { AnalysisResult } from '../../lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DigitChartsProps {
  stats: AnalysisResult;
}

export const DigitCharts: React.FC<DigitChartsProps> = ({ stats }) => {
  const data = Object.entries(stats.percentages).map(([digit, percent]) => ({
    digit: `Digit ${digit}`,
    percent: parseFloat(percent.toFixed(1)),
    val: digit
  }));

  const pieData = [
    { name: 'Even', value: stats.evenPercentage, fill: '#10b981' },
    { name: 'Odd', value: stats.oddPercentage, fill: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Digit Frequency Distribution (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="val" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #d1fae5', borderRadius: '8px', boxShadow: '0 4px 12px -2px rgba(16, 185, 129, 0.1)' }}
                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
              />
              <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={stats.hotDigits.includes(parseInt(entry.val)) ? '#10b981' : '#e2ece6'} 
                    className="hover:fill-emerald-400 transition-colors cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Even vs Odd</h3>
        <div className="h-64 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 uppercase font-black">Ratio</span>
            <span className="text-xl font-bold text-slate-800">{(stats.evenPercentage / (stats.oddPercentage || 1)).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};