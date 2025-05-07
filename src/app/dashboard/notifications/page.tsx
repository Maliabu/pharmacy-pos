/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { date, fetcher } from "@/app/services/services";
import { Loader2 } from "lucide-react";
import useSWR from "swr";

export type Notify = {
    id: number;
    notification: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    users: {
        name: string
    }

}

export default function Notifications(){
    let notify: Notify[] = []
    const { data, error } = useSWR("/api/notifications", fetcher);
    if(data){
        notify = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/></div>;

    const today = new Date()

    function status(status: string){
        if(status == "new"){
            return 'text-xs p-2 rounded-full text-green-700 dark:text-black bg-green-100 dark:bg-green-600 uppercase float-right'
        } else {
            return 'text-xs p-2 rounded-full text-gray-700 bg-gray-100 dark:bg-muted uppercase float-right'
        }
    }
    return (
        <div className="p-6 bg-background rounded-lg mt-2">
            <div className="text-2xl font-bold">Notifications</div>
            <div className="bg-muted rounded-lg p-6 w-1/2 mt-6 admin">
            
            {
                        notify.map((notes, index) => (
                            <div key={index} className="flex mb-1">
                     <div className="h-10 w-10 bg-primary text-muted font-bold text-2xl rounded-full flex justify-center items-center ">{notes.users.name[0]}</div>
                     <div className="p-6 mx-4 bg-background rounded-lg">
                        <div className={status(notes.status)}>{notes.status}</div>
                     <div className="text-xs font-bold text-muted-foreground">from: {notes.users.name}</div>
                       <div className="text-sm">{notes.notification}</div>
                       <div className="float-right text-xs text-muted-foreground p-2 font-bold">{date(notes.createdAt.toString())}</div>
                       </div>
                            </div>
                        ))
                    }
                <div className="flex">
                    <div>
                    <div className="h-10 w-10 bg-primary text-muted font-bold text-2xl rounded-full flex justify-center items-center ">!</div>
                    </div>
                    <div className="p-6 mx-4 bg-background rounded-lg">
                        <div className="text-xs font-bold text-muted-foreground">System Notification</div>
                        <div className="text-sm">Another tremendous work day, dont forget to record your expenses along with your daily sales for better accountability</div>
                        <div className="float-right text-xs text-muted-foreground p-2 font-bold">{date(today.toString())}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}