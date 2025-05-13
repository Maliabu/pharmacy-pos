import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';

const DonutChart = (props:{data:{name: string, value: number}[], name: string}) => {
  const COLORS = ['#4caf50', '#e0e0e030']; // Green for filled, gray for empty

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={props.data}
          cx="50%" // Position at the center of the chart
          cy="50%"
          innerRadius={60} // Radius of the hole (donut size)
          outerRadius={80} // Outer radius of the donut
          fill="#8884d8"
          stroke='#4caf5000'
          paddingAngle={5}
          dataKey="value"
        >
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
          <Label
            value={`${props.data[0].value.toFixed(2)}%`+` ${props.name}`} // Display percentage for filled section
            position="center" // Center of the donut
            style={{
              fontSize: '13px',
              fontWeight: 'bold',
              fill: '#555' // Text color for the percentage
            }}
          />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
