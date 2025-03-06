/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import useSWR from "swr";
import { Stock } from "../stock/dataColumns";
import { fetcher } from "@/app/services/services";
import { Loader2 } from "lucide-react";
import DonutChart from "./donuts";

export default function Page(){
    let stock: Stock[] = []
    const { data, error } = useSWR("/api/stock", fetcher);
    if(data){
        console.log(data)
        stock = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/></div>;

    function stockStatus(objects: Stock[]): [number, number, number] {
        const active: Stock[] = []
        let totalActive = 0, totalQuarantine = 0, totalSafety = 0
        const quarantine: Stock[] = [];
        const safety: Stock[] = [];
      
        objects.forEach((obj) => {
          const status = obj.stockStatus;

          if (status == "active") {
            active.push(obj);
          }
          if (status == "quarantine") {
            quarantine.push(obj);
          }
          if (status == "safety") {
            safety.push(obj);
          }
        });
        active.forEach((obj) => {
          totalActive+=obj.unitsPurchased
        })
        quarantine.forEach((obj) => {
          totalQuarantine+=obj.unitsPurchased
        })
        safety.forEach((obj) => {
          totalSafety+=obj.unitsPurchased
        })
        return [totalActive, totalQuarantine, totalSafety]
    }
    const perTotal = stockStatus(stock)[0] + stockStatus(stock)[1] + stockStatus(stock)[2]
    const perActive = (stockStatus(stock)[0]/perTotal)*100
    const perQuarantine = (stockStatus(stock)[1]/perTotal)*100
    const perSafety = (stockStatus(stock)[2]/perTotal)*100

    const activeData = [
        { name: 'Filled', value: perActive },
        { name: 'Empty', value: 100 - perActive }
      ];
      const quarantineData = [
        { name: 'Filled', value: perQuarantine },
        { name: 'Empty', value: 100 - perQuarantine }
      ];
      const safetyData = [
        { name: 'Filled', value: perSafety },
        { name: 'Empty', value: 100 - perSafety }
      ];
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div className="grid sm:grid-cols-3 gap-2">
            <div className="p-6 bg-green-600 text-green-200 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    {stockStatus(stock)[0]}
                </div>
                <span>Active Stock</span>
                <div className="text-sm leading-4 text-green-100 p-3 rounded-md bg-green-500 mt-4">Passed quality checks and Ready for dispatch or use</div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                {stockStatus(stock)[1]}
                </div>
                <span>Quarantine stock</span>
                <div className="text-sm leading-4 text-gray-200 p-3 rounded-md bg-gray-500 mt-4">Pending quality checks and NOT Ready for dispatch or use</div>
            </div>
            <div className="p-6 border text-red-600 border-red-600 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                {stockStatus(stock)[2]}
                </div>
                <span>Buffer/Safety Stock</span>
                <div className="text-sm leading-4 text-red-100 p-3 rounded-md bg-red-500 mt-4">Set Aside for emergency</div>
            </div>
        </div>
        <div>
            <div className="text-2xl tracking-tight font-bold mt-8">Stock Overview</div>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
            <DonutChart data={activeData} name="active"/>
            <DonutChart data={quarantineData} name="quarantine"/>
            <DonutChart data={safetyData} name="safety"/>
        </div>
    </div>
}