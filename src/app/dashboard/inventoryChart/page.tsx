"use client"

import useSWR from "swr";
import { Stock } from "../stock/dataColumns";
import { fetcher } from "@/app/services/services";
import { Loader2 } from "lucide-react";

export default function Page(){
    let stock: Stock[] = []
    const { data, error } = useSWR("/api/stock", fetcher);
    if(data){
        console.log(data)
        stock = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/></div>;

    function stockStatus(objects: Stock[]): [Stock[], Stock[], Stock[]] {
        const active: Stock[] = [];
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
        return [active, quarantine, safety]
    }
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div className="grid sm:grid-cols-3 gap-2">
            <div className="p-6 bg-lime-600 text-lime-200 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    {stockStatus(stock)[0].length}
                </div>
                <span>Active Stock</span>
                <div className="text-sm leading-4 text-lime-100 p-3 rounded-md bg-lime-500 mt-4">Passed quality checks and Ready for dispatch or use</div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                {stockStatus(stock)[1].length}
                </div>
                <span>Quarantine stock</span>
                <div className="text-sm leading-4 text-gray-200 p-3 rounded-md bg-gray-500 mt-4">Pending quality checks and NOT Ready for dispatch or use</div>
            </div>
            <div className="p-6 border text-red-600 border-red-600 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                {stockStatus(stock)[2].length}
                </div>
                <span>Buffer/Safety Stock</span>
                <div className="text-sm leading-4 text-red-100 p-3 rounded-md bg-red-500 mt-4">Set Aside for emergency</div>
            </div>
        </div>
        <div>
            <div className="text-2xl tracking-tight font-bold mt-8">Stock Overview</div>
        </div>
    </div>
}