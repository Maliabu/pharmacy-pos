import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface MonthData {
  month: number;
  totalAmount: number;
}

export interface YearData {
  year: number;
  months: MonthData[];
  totalSales: number
}

export default function Graph(props: { result: YearData[], graphId: string }) {

  // Prepare the data for the AreaChart
  const flattenedData = props.result.flatMap((yearData) =>
    yearData.months.map((monthData) => ({
      year: yearData.year,  // Pass year explicitly as part of the data
      month: monthData.month,
      totalAmount: monthData.totalAmount,
    }))
  );
  console.log(flattenedData)
  const totalSalesPerYear = props.result.map((yearData) => ({
    year: yearData.year,
    totalSales: yearData.totalSales,
  }));
  const areaComponents = props.result.map((yearData) => (
    <Area 
      key={yearData.year} 
      type="monotone" 
      dataKey="totalAmount" 
      stroke="#01814b" 
      fill={`url(#${props.graphId}-gradient-${yearData.year})`}      
      name={`${yearData.year}`}  // Use year as the name for the legend
    />
  ));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={flattenedData}>
        <CartesianGrid strokeDasharray="none" stroke="none" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload || payload.length === 0) return null;
            const data = payload[0].payload; // Get the first data point for the tooltip
            const year = data.year;
            const totalAmount = data.totalAmount;

            return (
              <div style={{
                backgroundColor: '#f5f5f5', // Custom background color
                borderRadius: '4px', // Rounded corners
                padding: '10px', // Padding
                fontSize: '12px', // Font size for text
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
                color: '#333', // Text color
              }}>
                <p><strong>Year: </strong>{year}</p>
                <p><strong>Month: </strong>{label}</p>
                <p><strong>Total Sales: </strong>{totalAmount.toLocaleString()}</p>
              </div>
            );
          }}
        />
        <Legend
          content={({ payload }) => (
            <ul style={{ fontSize: '13px', listStyleType: 'none' }}>
              {payload?.map((entry, index) => {
                const year = parseInt(entry.value);  // Access the year directly from the name
                const yearTotal = totalSalesPerYear.find((item) => item.year === year)?.totalSales;

                return (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    <strong>{year}:</strong> Total Sales: {yearTotal ? yearTotal.toLocaleString() : '0'}
                  </li>
                );
              })}
            </ul>
          )}
        />
        <defs>
          {props.result.map((yearData) => (
            <linearGradient id={`${props.graphId}-gradient-${yearData.year}`} key={yearData.year} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#01814b" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#bfbfbf" stopOpacity={0.4} />
            </linearGradient>
          ))}
        </defs>
        {areaComponents}
      </AreaChart>
    </ResponsiveContainer>
  );
}
