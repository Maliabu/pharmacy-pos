/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Stock } from "../stock/dataColumns";
import { BarChartBig, Info, Loader2, Pill, ThumbsUp } from "lucide-react";
import { date, fetcher, getMyMonth } from "@/app/services/services";
import useSWR from "swr";
import ActualSales from "./actualSales";
import Projections from "./projections";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MonthlySales from "./monthlySales";

export default function Page(){

    let stock: Stock[] = []
    const { data, error } = useSWR("/api/stock", fetcher);
    if(data){
        stock = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/></div>;

    function filterObjectsByDaysRemaining(objects: Stock[]): [Stock[], Stock[]] {
        const today = new Date();
        const result: Stock[] = [];
        const expired: Stock[] = [];
      
        objects.forEach((obj) => {
            if(obj.unitsPurchased >= 1){
                const targetDate = new Date(obj.expiryDate);
                const timeDiff = targetDate.getTime() - today.getTime();
                const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert time difference to days

                if (daysRemaining < 14 && targetDate > today) {
                    result.push(obj);
                }
                if (targetDate < today){
                    expired.push(obj);
                }
            }
        });
        return [result, expired]
    }

    const totalStock = () => {
        let total = 0
        if(stock.length > 0){
        stock.forEach(item => {
            if(item.unitsPurchased > 0){
            total+=item.unitsPurchased}
        })
        return total} else return 0
    }

    function currentMonth(){
        const currentMonth = new Date().getMonth() + 1
        const month = getMyMonth(currentMonth)
        return month    
    }
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div className="grid sm:grid-cols-3 gap-2">
            {totalStock() >=10?
            <div className="p-6 bg-primary text-green-200 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    {totalStock()}
                </div>
                <span>Products</span>
                <div className="text-sm leading-4 text-green-200 p-3 rounded-md bg-green-600 mt-4">Total products in stock</div>
            </div> :
            <div className="p-6 bg-red-600 text-red-200 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    {totalStock()}
                </div>
                <span>Products</span>
                <div className="text-sm leading-4 text-red-200 p-3 rounded-md bg-red-500 mt-4">You should probably re-stock</div>
            </div>}
            {totalStock() >= 1? filterObjectsByDaysRemaining(stock)[0].length >= 1?
            <div className="p-2 border border-red-600 text-red-600 rounded-lg col-span-2">
                <div className="flex justify-between items-center border-red-600 p-2">
                <div className=" font-bold tracking-tight leading-4">Stock due for Expiry (14 days window)</div>
                <div className="h-10 w-10 rounded-full dark:bg-red-500 bg-red-500 text-red-100 flex justify-center items-center">{filterObjectsByDaysRemaining(stock)[0].length}</div>
                </div>
                <Carousel className="sm:w-full w-[300px] sm:px-16 sm:py-6 dark:bg-red-600 bg-red-100 rounded-md">
                <CarouselContent className="-ml-1">
                    {filterObjectsByDaysRemaining(stock)[0].map((product) => (
                    <CarouselItem key={product.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="">
                        <Card className="shadow-none border-none bg-red-500 text-red-100 rounded-md">
                            <CardContent className="flex flex-col p-3">
                            <span className="text-base font-semibold">{product.name}</span>
                            <div className="text-sm">{date(product.expiryDate)}</div>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12 text-red-200 border bg-red-500 border-red-500 hover:bg-red-500 hover:text-red-300" />
                <CarouselNext className="mr-12 text-red-200 border bg-red-500 border-red-500 hover:bg-red-500 hover:text-red-300" />
                </Carousel>
            </div>:
            <div className="p-6 bg-muted rounded-lg col-span-2 flex bg-primary text-green-200 flex-col justify-center items-center">
                <ThumbsUp size={40}/>
                <div className="mt-2 p-2 bg-green-600 rounded-md">No items due to expire yet</div></div> : <div className="p-6 bg-muted rounded-lg col-span-2 flex bg-primary text-green-200 flex-col justify-center items-center">
                <ThumbsUp size={40}/>
                <div className="mt-2 p-2 bg-green-600 rounded-md">No items due to expire yet</div>
            </div>}
        </div>
        {totalStock() >= 1? filterObjectsByDaysRemaining(stock)[1].length >= 1?
            <div>
                <div className="text-gray-600 flex items-center justify-between font-bold my-2"> Expired Stock in Inventory <div className="h-10 w-10 flex justify-center rounded-full bg-red-600 text-white items-center">{filterObjectsByDaysRemaining(stock)[1].length}</div></div>
                <Carousel className="sm:w-full sm:px-16 mt-2 sm:py-6 bg-muted rounded-md">
                <CarouselContent className="-ml-1">
                    {filterObjectsByDaysRemaining(stock)[1].map((product) => (
                    <CarouselItem key={product.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="">
                        <Card className="shadow-none border-none bg-red-600 text-white rounded-md">
                            <CardContent className="flex flex-col p-3">
                            <span className="text-base font-semibold">{product.name}</span>
                            <div className="text-sm">{date(product.expiryDate)}</div>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-16 text-white border bg-red-500 border-red-500 hover:bg-red-500 hover:text-red-300" />
                <CarouselNext className="mr-16 text-white border bg-red-500 border-red-500 hover:bg-red-500 hover:text-red-300" />
                </Carousel>
            </div>:
            <div className="p-4 rounded-md bg-green-600 text-white">
                <Pill size={20}/>
                <div className="mt-2">No expired stock in inventory</div>
            </div>:
            <div className="p-4 rounded-md bg-red-600 text-white">
                <Info size={20}/>
                <div className="mt-2">Please re-stock</div>
            </div>
            }
        <div>
            <div className="border text-gray-700 dark:text-gray-400 p-6 rounded-lg mt-2">
                <div className="flex flex-row bg-green-600 text-green-200 p-6 rounded-lg">
                    <div><BarChartBig size={60}/>
                    <div className="text-sm">CurrentMonth sales</div>
                    </div>
                    <div className="px-5 border-l ml-5">
                        <div className="text-sm">{date(Date())}</div>
                        <div className="text-4xl font-bold tracking-tight">{currentMonth()}</div>
                        <div className="text-sm">Sales for this month</div>
                    </div>
                </div>
                <MonthlySales/>
            </div>
            { stock.length > 0 ?
        <div>
            <div className=" mt-8 rounded-md">
                <div className="text-md tracking-tight">Actual Sales</div>
                <div className="text-sm tracking-tight text-muted-foreground">Actual Sales made from products paid for in full</div>
                <ActualSales/>
                </div>
            <div className="mt-8">
                <div className="text-md tracking-tight">Sales Projection</div>
                <div className="text-sm tracking-tight text-muted-foreground">projections for Sales made from products paid for in full and those pending payment</div>
                <Projections/>
                </div></div> : <div className="p-16 rounded-lg bg-green-600 text-white flex flex-col justify-center mt-4">
                    Hello, lets add some stock and get to work?
                    <Link href="/dashboard/management" className="mt-2"><Button>Add Stock</Button>
                    </Link>
                    </div>}
        </div>
    </div>
}