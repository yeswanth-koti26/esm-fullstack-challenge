import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RaceData {
  year: number;
  race_count: number;
}

const RacesPerYearChart: React.FC = () => {
  const [data, setData] = useState<RaceData[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/dashboard/races_per_year')
      .then((res) => res.json())
      .then((data: RaceData[]) => setData(data))
      .catch((err) => {
        console.error('Failed to fetch race data:', err);
      });
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>🏁 Races Per Year</h2>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="race_count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RacesPerYearChart;
