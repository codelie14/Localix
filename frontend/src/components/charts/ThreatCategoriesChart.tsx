import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend } from
'recharts';
const data = [
{
  name: 'Malware',
  value: 35,
  color: '#ef4444'
},
{
  name: 'Phishing',
  value: 28,
  color: '#f59e0b'
},
{
  name: 'Ransomware',
  value: 18,
  color: '#10b981'
},
{
  name: 'DDoS',
  value: 12,
  color: '#6366f1'
},
{
  name: 'Other',
  value: 7,
  color: '#6b7280'
}];

export function ThreatCategoriesChart() {
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
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="#000000"
              strokeWidth={2}>

              {data.map((entry, index) =>
              <Cell key={`cell-${index}`} fill={entry.color} />
              )}
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