/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Stock(){

    function Packaging(){
        const packages: any[] = []
        const { data, error } = useSWR("/api/packaging", fetcher);
        if(data){
            packages.push(data)
            return packages
        } else return []
    }
    function Currency(){
        const currencies: any[] = []
        const { data, error } = useSWR("/api/currency", fetcher);
        if(data){
            currencies.push(data)
            return currencies
        } else return []
    }

    return<div>

    </div>
}