import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { api } from '../../services/api';

interface ThreatCategory {
  name: string;
  value: number;
  color: string;
}

const categoryColors: Record<string, string> = {
  'Malware': '#ef4444',
  'Phishing': '#f59e0b',
  'Ransomware': '#10b981',
  'DDoS': '#6366f1',
  'Other': '#6b7280'
};

export function ThreatCategoriesChart() {
  const [chartData, setChartData] = useState<ThreatCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch threat data and aggregate by category
    // For now, using mock data - will be replaced with actual API call
    const mockData: ThreatCategory[] = [
      { name: 'Malware', value: 35, color: categoryColors['Malware'] },
      { name: 'Phishing', value: 28, color: categoryColors['Phishing'] },
      { name: 'Ransomware', value: 18, color: categoryColors['Ransomware'] },
      { name: 'DDoS', value: 12, color: categoryColors['DDoS'] },
      { name: 'Other', value: 7, color: categoryColors['Other'] }
    ];
    
    setChartData(mockData);
    setLoading(false);
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        delay: 0.4
      }}
      className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-5 neon-box-green">

      {/* ASCII corners */}
      <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
        ┌
      </span>
      <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
        ┐
      </span>
      <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
        └
      </span>
      <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
        ┘
      </span>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-500 text-xs">[</span>
        <span className="text-gray-400 text-xs uppercase tracking-wider">
          Threat Categories
        </span>
        <span className="text-gray-500 text-xs">]</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="#000000"
              strokeWidth={2}>

              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #10b98140',
                borderRadius: '8px',
                boxShadow: '0 0 10px #10b98120'
              }}
              labelStyle={{
                color: '#10b981'
              }}
              itemStyle={{
                color: '#e5e5e5'
              }}
              formatter={(value: number) => [`${value}%`, 'Share']} />

            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) =>
              <span className="text-gray-400 text-xs">{value}</span>
              } />

          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>);

}