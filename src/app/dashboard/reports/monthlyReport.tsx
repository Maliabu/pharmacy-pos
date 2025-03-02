/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { fetcher, getMyMonth } from "@/app/services/services";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


type MonthReport = {
    id: number
    monthDate: string
    month: string
}

export default function MonthlyReport(props: {monthDate: string, month: string}){

  let report: MonthReport[] = []
  const { data, error } = useSWR("/api/reports/monthlyReport", fetcher);
  if(data){
      report = data
  }

  let reportCheck: MonthReport[] = []
  const monthlyReportCheck = {monthDate: props.monthDate, month: props.month}
  const { data: check, error: checkError } = useSWR(props.month && props.monthDate?`/api/reports/${monthlyReportCheck}`:null, fetcher);
  if(check){
      reportCheck = check
  }
  if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading reports ...</div>;
  if (!data) return <div>loading...</div>

  const monthToday = new Date().getMonth()
  const month = getMyMonth(monthToday)
  // check monthly report for no entries yet

    return<div className=" p-3 bg-muted rounded-md text-sm grid">
    {
        reportCheck.length == 0 && report.length > 0?
        report.map(reports => (
            <div key={reports.id} className="col-span-3 bg-background p-4 rounded-md">
                <div className="flex flex-row justify-between">
                    <div>{reports.monthDate} {reports.month}</div>
                    <div>
                    <Dialog>
                    <DialogTrigger>
                    <img src="/pdf.png" alt="pdf image" width={25} height={30}/></DialogTrigger>
                    <DialogContent className="sm:w-[800px] h-screen overflow-y-auto">
                    <DialogHeader className="hidden">
                    <DialogTitle>Invoice</DialogTitle>
                    <DialogDescription>
                        Invoice template
                    </DialogDescription>
                    </DialogHeader>
                    hey report
                    </DialogContent>
                    </Dialog>
                    </div>
                </div>
            </div>
        )):null
    }
</div>
}