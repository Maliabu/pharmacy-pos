/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { fetcher } from "@/app/services/services";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import Reports from "./reports";
import { useEffect, useState } from "react";
import MonthlyReport from "./monthlyReport";

type Settings = {
    id: number
    monthDate: string
    user: string
}

export default function ReportSettings(){
  const [report, setReport] = useState([]);

  let settings: Settings[] = []
  const { data, error } = useSWR("/api/reports", fetcher);
  const {data: reports, error: reportError} = useSWR('/api/reports/generateReport', fetcher)
  useEffect(() => {
    if (reports == undefined) {
        setReport([]); // Store the generated report
      } else if(reports.length > 0) {
        setReport(reports); // Store the generated report
      }
  }, [reports]);

  if(data){
    settings = data
  }
  console.log(settings)
  if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading settings ...</div>;



  return<div className="bg-background p-8 rounded-lg mt-2">
    <div className="text-3xl font-bold tracking-tight">Reports</div>
    <div className="text-sm text-muted-foreground mt-8">Settings</div>
    <div className="text-sm">Set a date for when reports will be generated every month (number between 1 and 7). If no date is set then by DEFAULT reports will be generated on the LAST DAY of the month at MIDNIGHT.</div>

    <div className="flex flex-row justify-between bg-muted p-2 mt-2 rounded-lg">
      <div>
    <Reports/></div>
    <div className=" p-3 rounded-md text-sm">
    Current Setting: <span className="p-2 ml-4 bg-destructive text-white rounded-md">{settings[0].monthDate}</span>
    </div>
      </div>
      <MonthlyReport monthDate={settings[0].monthDate}/>
    </div>  
}