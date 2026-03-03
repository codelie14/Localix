import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell } from
'recharts';
const data = [
{
  vendor: 'Microsoft',
  vulnerabilities: 245,
  color: '#10b981'
},
{
  vendor: 'Apache',
  vulnerabilities: 189,
  color: '#10b981'
},
{
  vendor: 'Oracle',
  vulnerabilities: 156,
  color: '#f59e0b'
},
{
  vendor: 'Linux',
  vulnerabilities: 134,
  color: '#f59e0b'
},
{
  vendor: 'Cisco',
  vulnerabilities: 98,
  color: '#ef4444'
},
{
  vendor: 'Adobe',
  vulnerabilities: 87,
  color: '#ef4444'
}];

export function TopVendorsChart() {
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
        delay: 0.3
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
          Top Vendors by CVE
        </span>
        <span className="text-gray-500 text-xs">]</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#10b98120"
              horizontal={false} />

            <XAxis
              type="number"
              stroke="#6b7280"
              tick={{
                fill: '#6b7280',
                fontSize: 11
              }}
              axisLine={{
                stroke: '#10b98130'
              }} />

            <YAxis
              type="category"
              dataKey="vendor"
              stroke="#6b7280"
              tick={{
                fill: '#6b7280',
                fontSize: 11
              }}
              axisLine={{
                stroke: '#10b98130'
              }}
              width={80} />

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
              formatter={(value: number) => [`${value} CVEs`, 'Count']} />

            <Bar dataKey="vulnerabilities" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) =>
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                fillOpacity={0.8} />

              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>);

}