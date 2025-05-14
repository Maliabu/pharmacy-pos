/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { fetcher, getMyMonth } from "@/app/services/services";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { newReport } from "@/server/fetch.actions";
import NewMonthReport from "./newReport";
import { useEffect } from "react";

type MonthReport = {
    id: number
    monthDate: string
    month: string
}

export default function MonthlyReport(props: {monthDate: string}){
    async function logReport(){
        await newReport(props.monthDate, month)
    }

  let report: MonthReport[] = []
  const { data, error } = useSWR("/api/reports/monthlyReport", fetcher);
  if(data){
      report = data
  }

  const monthToday = new Date().getMonth() + 1
  const dateToday = new Date().getDate()
  const month = getMyMonth(monthToday) || ''

  let reportCheck: MonthReport[] = []
  const monthlyReportCheck = {monthDate: props.monthDate, month: month}
  const { data: check, error: checkError } = useSWR(month && props.monthDate?`/api/reports/${monthlyReportCheck}`:null, fetcher);

  useEffect(() => {
  if(check){
    reportCheck = check
    if(reportCheck.length == 0){
      // lets add a report
      logReport()
    }
}
  }, [])
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading reports ...</div>;
    if (!data) return <div>loading...</div>
    // check monthly report for no entries yet

    return<div className=" p-3 bg-muted rounded-md text-sm grid sm:grid-cols-3 gap-2 mt-1">
    {
        report.length > 0?
        report.map(reports => (
            <div key={reports.id} className=" bg-background rounded-md">
                <div className="flex flex-row justify-between">
                    <div className="font-bold p-3 rounded-l-md">{reports.monthDate}<br/> {reports.month}</div>
                    <div className="p-3">
                    <Dialog>
                    <DialogTrigger>
                    <img src="/pdf.png" alt="pdf image" width={25} height={30}/></DialogTrigger>
                    <DialogContent className="max-w-fit h-screen overflow-y-auto">
                    <DialogHeader className="hidden">
                    <DialogTitle>Invoice</DialogTitle>
                    <DialogDescription>
                        Invoice template
                    </DialogDescription>
                    </DialogHeader>
                    <NewMonthReport month={reports.month}/>
                    </DialogContent>
                    </Dialog>
                    </div>
                </div>
            </div>
        )):<div>
            <div className="text-sm p-2 bg-muted rounded-md">To report on (date of month): {props.monthDate == 'default'?'last day of the month': props.monthDate}</div>
        </div>
    }
</div>
}