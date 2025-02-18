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

export default function Graph(props: { invoices: YearData[], receipts: YearData[], graphId: string }) {

  // Prepare the data for the AreaChart
  const flattenedData = props.invoices.flatMap((yearData) =>
    yearData.months.map((monthData) => ({
      year: yearData.year,  // Pass year explicitly as part of the data
      month: monthData.month,
      totalAmount: monthData.totalAmount,
      type: 'Invoice'
    }))
  );

  const flattenedReceiptData = props.receipts.flatMap((yearData) =>
    yearData.months.map((monthData) => ({
      year: yearData.year,  // Pass year explicitly as part of the data
      month: monthData.month,
      totalAmount: monthData.totalAmount,
      type: 'Receipt'
    }))
  );

  // Combine invoices and receipts data into a single array
  const combinedData = [...flattenedData, ...flattenedReceiptData];

  // Area components for both invoices and receipts
  // Area components for both invoices and receipts
const areaCombinedComponents = [
  ...props.invoices.map((yearData) => (
    <Area 
      key={`invoice-${yearData.year}`} 
      type="monotone" 
      dataKey="totalAmount" 
      stroke="#4caf50"  // Green for invoices
      fill={`url(#-gradient-invoice-${yearData.year})`}  // Green gradient for invoices
      stackId="stack1"
      name={`${yearData.year} Invoices`} 
    />
  )),
  ...props.receipts.map((yearData) => (
    <Area 
      key={`receipt-${yearData.year}`} 
      type="monotone" 
      dataKey="totalAmount" 
      stroke="#4caf50"  // Blue for receipts
      fill={`url(#-gradient-receipt-${yearData.year})`}  // Blue gradient for receipts
      stackId="stack2"
      name={`${yearData.year} Receipts`} 
    />
  ))
];


  return (
    <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={combinedData}>
      <CartesianGrid strokeDasharray="none" stroke="none" />
      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip
        content={({ payload, label }) => {
          if (!payload || payload.length === 0) return null;
          const data = payload[0].payload; // Get the first data point for the tooltip
          const year = data.year;
          const name = data.type
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
              <p><strong>{name}</strong></p>
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
              const [year, type] = entry.value.split(' ');  // Extract the year and type (either 'Invoices' or 'Receipts')
              const yearNum = parseInt(year);  // Convert year to number
              let yearTotal = 0;

              // Check if the entry is for 'Invoices' or 'Receipts' and match accordingly
              if (type === 'Invoices') {
                yearTotal = props.invoices.find((item) => item.year === yearNum)?.totalSales || 0;
              } else if (type === 'Receipts') {
                yearTotal = props.receipts.find((item) => item.year === yearNum)?.totalSales || 0;
              }

              return (
                <li key={index} style={{ marginBottom: '5px' }}>
                  <strong>{entry.value}:</strong> Total Sales: {yearTotal.toLocaleString()}
                </li>
              );
            })}
          </ul>
        )}
      />
      <defs>
        {props.invoices.map((yearData) => (
          <linearGradient
            id={`-gradient-invoice-${yearData.year}`}
            key={`invoice-${yearData.year}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4caf50" stopOpacity={0.8} /> {/* Green color for invoices */}
            <stop offset="100%" stopColor="#ffffff00" stopOpacity={0.4} />
          </linearGradient>
        ))}

        {props.receipts.map((yearData) => (
          <linearGradient
            id={`-gradient-receipt-${yearData.year}`}
            key={`receipt-${yearData.year}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4caf50" stopOpacity={0.8} /> {/* Blue color for receipts */}
            <stop offset="100%" stopColor="#ffffff00" stopOpacity={0.4} />
          </linearGradient>
        ))}
      </defs>

      {areaCombinedComponents}
    </AreaChart>
  </ResponsiveContainer>
  );
}
