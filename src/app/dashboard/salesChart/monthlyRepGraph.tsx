/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface MonthData {
  month: string;
  day: number;
  totalAmount: number;
}

export interface YearData {
  year: number;
  months: MonthData[];
  totalSales: number;
}

export default function MonthRepGraph(props: { invoices: YearData[], receipts: YearData[], graphId: string, bills: YearData[] }) {

  // Prepare the data for the LineChart (flattened daily data)
  const flattenedData = props.invoices.flatMap((yearData) =>
    yearData.months.flatMap((monthData) => ({
      year: yearData.year,  // Pass year explicitly as part of the data
      month: monthData.month,
      day: monthData.day,
      totalAmount: monthData.totalAmount,
      type: 'Invoices'
    }))
  );

  const flattenedReceiptData = props.receipts.flatMap((yearData) =>
    yearData.months.flatMap((monthData) => ({
      year: yearData.year,  // Pass year explicitly as part of the data
      month: monthData.month,
      day: monthData.day,
      totalAmount: monthData.totalAmount,
      type: 'Receipts'
    }))
  );

  const flattenedBillData = props.bills.flatMap((yearData) =>
    yearData.months.flatMap((monthData) => ({
      year: yearData.year,  // Pass year explicitly as part of the data
      month: monthData.month,
      day: monthData.day,
      totalAmount: monthData.totalAmount,
      type: 'Bills'
    }))
  );

  // Combine invoices and receipts data into a single array
  const combinedData = [...flattenedData, ...flattenedReceiptData, ...flattenedBillData];

  // Group the data by year and type (Invoice/Receipt)
  const groupedData = combinedData.reduce((acc, data) => {
    const { year, type, day, totalAmount } = data;
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][type]) {
      acc[year][type] = [];
    }
    acc[year][type].push({ day, totalAmount });
    return acc;
  }, {} as Record<number, Record<string, { day: number; totalAmount: number }[]>>);

  // Calculate total sales for each year and type
  const calculateTotalSales = (yearNum: number, type: string) => {
    const typeData = groupedData[yearNum]?.[type] || [];
    return typeData.reduce((total, data: {day: number, totalAmount: number}) => total + data.totalAmount, 0);
  };

  // Group transformed data for plotting
  const transformedData = combinedData.reduce((acc, data) => {
    const { day, totalAmount, type } = data;

    // Find the existing data for the current day
    let dayData = acc.find(item => item.day === day);

    // If no entry exists for this day, create one
    if (!dayData) {
      dayData = { day, Invoices: 0, Receipts: 0, Bills: 0 };
      acc.push(dayData);
    }

    // Add the totalAmount to the correct field (Invoices or Receipts)
    if (type === 'Invoices') {
      dayData.Invoices += totalAmount;
    } if (type === 'Receipts') {
      dayData.Receipts += totalAmount;
    }else if (type === 'Bills') {
      dayData.Bills += totalAmount;
    }

    return acc;
  }, [] as { day: number, Invoices: number, Receipts: number, Bills: number }[]);

  // Line components for both invoices and receipts
  const lineCombinedComponents = [
    ...props.invoices.map((yearData) => (
      <Line
        key={`${yearData.year} Invoices`}
        type="monotone"
        dot={false}
        dataKey="Invoices"
        stroke="#4caf50"  // Green for invoices
        name={`${yearData.year} Invoices`} // Including year in the name
      />
    )),
    ...props.receipts.map((yearData) => (
      <Line
        key={`${yearData.year} Receipts`}
        dot={false}
        type="monotone"
        dataKey="Receipts"
        stroke="#2196f3"  // Blue for receipts
        name={`${yearData.year} Receipts`} // Including year in the name
      />
    )),
    ...props.bills.map((yearData) => (
      <Line
        key={`${yearData.year} Bills`}
        type="monotone"
        dot={false}
        dataKey="Bills"
        stroke="#000"  // Blue for receipts
        name={`${yearData.year} Bills`} // Including year in the name
      />
    ))
  ];

  return (
    <ResponsiveContainer width="100%" height={800}>
      <LineChart data={transformedData}>
        <CartesianGrid strokeDasharray="none" stroke="none" />
        {/* <XAxis dataKey="day" tick={{ fontSize: 12 }} />  XAxis shows days */}
        {/* <YAxis tick={{ fontSize: 12 }} className='hidden' /> */}
        <Tooltip
          content={({ payload, label }) => {
            if (!payload || payload.length === 0) return null;
            const data = payload[0].payload; // Get the first data point for the tooltip
            const { Invoices, Receipts, Bills } = data;

            return (
              <div style={{
                backgroundColor: '#f5f5f5', // Custom background color
                borderRadius: '4px', // Rounded corners
                padding: '5px', // Padding
                fontSize: '12px', // Font size for text
                boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)', // Shadow effect
                color: '#333', // Text color
              }}>
                <p><strong>Day: </strong>{label}</p>  {/* Showing Day */}
                <p><strong>Invoices: </strong>{Invoices.toLocaleString()}</p>
                <p><strong>Receipts: </strong>{Receipts.toLocaleString()}</p>
                <p><strong>Bills: </strong>{Bills.toLocaleString()}</p>
              </div>
            );
          }}
        />
        <Legend
          content={({ payload }) => {
            return (
              <div style={{ fontSize: '13px', listStyleType: 'none' }} className='grid grid-cols-1 gap-4 mt-4 admin'>
                {payload?.map((entry, index) => {
                  // Split the year and type from the entry value (e.g., "2021 Invoices")
                  const [year, ...typeParts] = entry.value.split(' ');
                  const type = typeParts.join(' '); // Join the rest of the parts to get the type (Invoices or Receipts)

                  const yearNum = parseInt(year);  // Convert year to number

                  // Check if yearNum is valid
                  if (isNaN(yearNum)) {
                    console.error('Invalid yearNum:', year);
                    return null;
                  }

                  // Access the typeData from groupedData using the year and type
                  const typeData = groupedData[yearNum]?.[type] || [];  // Safely access type data for this year

                  // Calculate total sales for this year and type
                  const totalSales = calculateTotalSales(yearNum, type);

                  return (
                    <div key={index} style={{ marginBottom: '10px' }} className='flex flex-col'>
                      <strong>{entry.value}: Total Sales: {totalSales.toLocaleString()}</strong>
                      <div className='graph-scroll'>
                        {typeData.length > 0 ? (
                          typeData.map((data, i) => (
                            <div key={i} className='flex p-1 border-b mt-1'>
                              <span className='mr-5'>Day {data.day}:</span> {data.totalAmount.toLocaleString()}
                            </div>
                          ))
                        ) : (
                          <li>No data available for this type</li>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
        {lineCombinedComponents}
      </LineChart>
    </ResponsiveContainer>
  );
}
