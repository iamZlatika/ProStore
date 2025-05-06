'use client';

import type { TSalesData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ChartsProps {
  data: { salesData: TSalesData[] };
}
const Charts = ({ data }: ChartsProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data.salesData}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[40, 40, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
