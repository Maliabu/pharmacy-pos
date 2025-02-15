/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Loader2, ThumbsUp } from "lucide-react";
import { date, fetcher, getMyMonth } from "@/app/services/services";
import useSWR from "swr";
import { Invoice } from "../invoice/invoiceColumns";
import { json } from "stream/consumers";
import Stock from "../stock/stock";
import Graph, { YearData } from "./paidGraph";

export default function ActualSales(){

    let invoices: Invoice[] = []
    const { data, error } = useSWR("/api/invoice/status/paid", fetcher);
    if(data){
        invoices = data
    }
    
    // Step 1: Grouping by year and month
const groupByYearMonth = (data1: Invoice[]) => {
    return data1.reduce((acc, invoice) => {
      invoice.invoiceItems.forEach((item: { createdAt: string; total: number; product:number }) => {
        // Get the year and month from createdAt
        const createdAt = new Date(item.createdAt);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1; // Get month (1-12)
  
        // Initialize the structure if it's not already present
        if (!acc[year]) {
          acc[year] = {};
        }
  
        if (!acc[year][month]) {
          acc[year][month] = 0;
        }
  
        // Accumulate the amount for the respective year and month
        acc[year][month] += item.total;
      });
      return acc;
    }, {} as Record<number, Record<number, number>>);
  };
  
  // Step 2: Structure the data for the graph
  const prepareForGraph = (groupedData: Record<number, Record<number, number>>) => {
    const result: YearData[] = [];
  
    Object.keys(groupedData).forEach(year => {
      const months = groupedData[parseInt(year)];
      const monthData: any[] = [];
      let totalSalesPerYear = 0; // Variable to hold the total sales for the current year
  
      for (let month = 1; month <= 12; month++) {
        const totalAmount = months[month] || 0;
        
        // Add to total sales for the year
        totalSalesPerYear += totalAmount;
        
        monthData.push({
          month: getMyMonth(month),  // Assuming getMyMonth() returns the month name or number
          totalAmount: totalAmount
        });
      }
  
      result.push({
        year: parseInt(year),
        months: monthData,
        totalSales: totalSalesPerYear  // Add the total sales for this year
      });
    });
  
    return result;
};

  
  // Step 3: Prepare the data for graph
  const groupedData = groupByYearMonth(invoices);
  const dataForGraph = prepareForGraph(groupedData);
    
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/></div>;
    
    return<div className="bg-background py-16 rounded-lg mt-2">
        <Graph result={dataForGraph}/>
    </div>
}