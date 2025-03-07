/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Loader2 } from "lucide-react";
import { fetcher, getMyMonth } from "@/app/services/services";
import useSWR from "swr";
import { Invoice } from "../invoice/invoiceColumns";
import Graph, { YearData } from "./monthGraph";
import { Receipt } from "../order/page";
import MonthGraph from "./monthGraph";
import { Bill } from "../bills/billColumns";

export default function MonthlySales() {

    let invoices: Invoice[] = [];
    const { data, error } = useSWR("/api/invoice/status/paid", fetcher);
    if (data) {
        invoices = data;
    }

    let receipts: Receipt[] = [];
    const { data: data1, error: error1 } = useSWR("/api/receipt/receipt", fetcher);
    if (data1) {
        receipts = data1;
    }

    let bills: Bill[] = []
    const { data: data2, error: error2 } = useSWR("/api/bills", fetcher);
    if(data2){
        bills = data2
    }
    
    // Step 1: Grouping by day (instead of year and month)
    const groupByDay = (data1: Invoice[]) => {
        const currentMonth = new Date().getMonth(); // Get the current month (0-11)
        const currentYear = new Date().getFullYear(); // Get the current year
        return data1.reduce((acc, invoice) => {
            invoice.invoiceItems.forEach((item: { createdAt: string; total: number; product: number }) => {
                // Get the date from createdAt
                const createdAt = new Date(item.createdAt);
                const day = createdAt.getDate(); // Get the day of the month (1-31)
                const month = createdAt.getMonth(); // Get the month (0-11)
                const year = createdAt.getFullYear(); // Get the year

                // Only accumulate data for the current month and year
                if (month === currentMonth && year === currentYear) {
                    if (!acc[day]) {
                        acc[day] = 0;
                    }
                    acc[day] += item.total;
                }
            });
            return acc;
        }, {} as Record<number, number>);
    };

    const groupByDay1 = (data1: Receipt[]) => {
        const currentMonth = new Date().getMonth(); // Get the current month (0-11)
        const currentYear = new Date().getFullYear(); // Get the current year
        return data1.reduce((acc, receipt) => {
            receipt.receipts.forEach((item: { createdAt: string; quantity: number; product: { name: string, unitAmount: number, unitsPurchased: number } }) => {
                // Get the date from createdAt
                const createdAt = new Date(item.createdAt);
                const day = createdAt.getDate(); // Get the day of the month (1-31)
                const month = createdAt.getMonth(); // Get the month (0-11)
                const year = createdAt.getFullYear(); // Get the year

                // Only accumulate data for the current month and year
                if (month === currentMonth && year === currentYear) {
                    const unitAmount = item.product.unitAmount;
                    if (!acc[day]) {
                        acc[day] = 0;
                    }
                    acc[day] += item.quantity * unitAmount;
                }
            });
            return acc;
        }, {} as Record<number, number>);
    };

    const groupByDay2 = (data1: Bill[]) => {
        const currentMonth = new Date().getMonth(); // Get the current month (0-11)
        const currentYear = new Date().getFullYear(); // Get the current year
        return data1.reduce((acc, bill) => {
                // Get the date from createdAt
                const createdAt = new Date(bill.createdAt);
                const day = createdAt.getDate(); // Get the day of the month (1-31)
                const month = createdAt.getMonth(); // Get the month (0-11)
                const year = createdAt.getFullYear(); // Get the year

                // Only accumulate data for the current month and year
                if (month === currentMonth && year === currentYear) {
                    if (!acc[day]) {
                        acc[day] = 0;
                    }
                    acc[day] += bill.amount;
                }
            return acc;
        }, {} as Record<number, number>);
    };

    // Step 2: Structure the data for the graph
    const prepareForGraph = (groupedData: Record<number, number>) => {
        const result: YearData[] = [];
        const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
        
        // Get the total number of days in the current month
        const daysInMonth = new Date(new Date().getFullYear(), currentMonth, 0).getDate(); // Total days in the current month
        const monthData: { day: number; month: string; totalAmount: number }[] = [];

        // Prepare the data for each day of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const totalAmount = groupedData[day] || 0; // Amount for that day or 0 if no data
            monthData.push({
                day: day, // Use day number as the label
                month: getMyMonth(currentMonth) || "",
                totalAmount: totalAmount
            });
        }

        result.push({
            year: new Date().getFullYear(),
            months: monthData, // Add month data (now it is by days)
            totalSales: monthData.reduce((total, entry) => total + entry.totalAmount, 0) // Sum of total sales for the month
        });

        return result;
    };

    // Step 3: Prepare the data for the graph
    const groupedData = groupByDay(invoices);
    const dataForGraph = prepareForGraph(groupedData);

    const groupedData1 = groupByDay1(receipts);
    const dataForGraph1 = prepareForGraph(groupedData1);

    const groupedData2 = groupByDay2(bills);
    const dataForGraph2 = prepareForGraph(groupedData2);
    
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin" /></div>;

    return <div className="bg-transparent pt-16 rounded-lg mt-2">
        <MonthGraph invoices={dataForGraph} graphId="actual" receipts={dataForGraph1} bills={dataForGraph2}/>
    </div>;
}
