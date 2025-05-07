/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { Stock } from "../stock/dataColumns";
import useSWR from "swr";
import { date, fetcher } from "@/app/services/services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt } from "../order/page";
import { ReceiptItems } from "../order/previewReceipt";
import { Bill } from "../bills/billColumns";
import { Invoice } from "../invoice/invoiceColumns";

export default function NewMonthReport(props: {month: string}){
    interface ReceiptItems1{
        id: number
        quantity: number
        product: {
            name: string
            unitAmount: number
            unitsPurchased: number
            totalPurchaseAmount: number
        },
        createdAt: string
      }
    interface InvoiceItems{
        id: number
        product: {
            name: string
            unitAmount: number
            unitsPurchased: number
            totalPurchaseAmount: number
        },
        quantity: number
        total: number
        createdAt: string
    }
    // lets get all data for the month
    // stock expired in the month
    let stock: Stock[] = []
    const expStock: Stock[] = []
    let totalUnitStock = 0
    let totalLostToExpiredStock = 0
    let purchaseCost = 0
    const { data, error } = useSWR("/api/stock", fetcher);
    if(data){
        stock = data
        // expired stock in month means loss made
        stock.forEach((obj) => {
            const expMonth = date(obj.expiryDate).split(' ')[1]
            if(expMonth == props.month.slice(0, 3) && obj.unitsPurchased > 0){
                expStock.push(obj)
                totalUnitStock += obj.unitsPurchased
                totalLostToExpiredStock += (obj.unitAmount * obj.unitsPurchased)
                purchaseCost += obj.totalPurchaseAmount
            }
        })
    }
    // all receipts for the month
    let receipts: ReceiptItems1[] = []
    const receipt: ReceiptItems1[] = []
    let totalUnitStockSold = 0
    let totalStockSales = 0
    let stockPurchaseCost = 0
    const { data: monthReceipt, error: receiptErr } = useSWR("/api/receipt/receiptItems", fetcher);
    if(monthReceipt){
        receipts = monthReceipt
        // receipts for the month
        receipts.forEach((obj) => {
            const receiptMonth = date(obj.createdAt.toString()).split(' ')[1]
            if(receiptMonth == props.month.slice(0, 3)){
                receipt.push(obj)
            }
        })
        receipt.forEach((obj) => {
            totalUnitStockSold += obj.quantity
            totalStockSales += (obj.product.unitAmount * obj.quantity)
            stockPurchaseCost += obj.product.totalPurchaseAmount
        })
    }
    // all invoices for the month
    let invoices: InvoiceItems[] = []
    const paidInvoices: InvoiceItems[] = []
    let totalInvoiceAmount = 0
    const { data: invoice, error: invoiceErr } = useSWR("/api/invoiceItems", fetcher);
    if(invoice){
        invoices = invoice
        // expired stock in month means loss made
        invoices.forEach((obj) => {
            const expMonth = date(obj.createdAt).split(' ')[1]
            if(expMonth == props.month.slice(0, 3)){
                paidInvoices.push(obj)
                totalInvoiceAmount += obj.total
            }
        })
    }
    // all expenses for the month
    let bills: Bill[] = []
    const expense: Bill[] = []
    let totalExpenses = 0
    const { data: bill, error: billErr } = useSWR("/api/bills", fetcher);
    if(bill){
        bills = bill
        // expired stock in month means loss made
        bills.forEach((obj) => {
            const expMonth = date(obj.createdAt).split(' ')[1]
            if(expMonth == props.month.slice(0, 3)){
                expense.push(obj)
                totalExpenses += obj.amount
            }
        })
    }
    if(!monthReceipt) return <div>Loading receipts...</div>
    return (
        <div className="sm:p-8 rounded-md sm:w-[800px]">
            <div className="pb-6 flex flex-col items-center justify-center text-center">
            <Image src="https://res.cloudinary.com/dwklt6k9c/image/upload/v1739947271/logo_filskw.png" alt="logo" width={200} height={100} unoptimized/>
            </div>
            <div className="flex justify-between border-b py-3">
                <div className="text-5xl font-bold tracking-tight">Report</div>
                <div className="flex flex-col text-sm">
                    <p><span className="font-bold">Month: </span>{props.month}</p>
                </div>
            </div>
            <div className="text-2xl font-bold tracking-tight my-6">Summary</div>
            <div className="text-sm">Below is a sales report for the month of {props.month}, detailing all sales and expenses, profits and losses, stock status analysis for the month including staff active for the month.</div>
            <div className="flex justify-between my-8 bg-green-600 text-green-100 p-2">
                <div>1.1</div>
            <div className="text-lg font-bold tracking-tight">STOCK STATUS</div></div>
            <div className="font-bold">Stock Sales Report</div>
            {
                expStock.length > 0 ?
                    <div>
                        <Table className="small-receipt">
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >Stock</TableHead>
                    <TableHead >Qty</TableHead>
                    <TableHead >Unit Amount</TableHead>
                    <TableHead >Total Amount</TableHead>
                    <TableHead >Initial Total Purchase</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {receipt.map((receipt, index) => (
                    <TableRow key={index}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{receipt.product.name}</TableCell>
                        <TableCell className="font-medium">{receipt.quantity}</TableCell>
                        <TableCell className="font-medium">{receipt.product.unitAmount.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{(receipt.product.unitAmount * receipt.quantity).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{receipt.product.totalPurchaseAmount}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell colSpan={2}>{totalUnitStockSold}</TableCell>
                    <TableCell>{totalStockSales.toLocaleString()}</TableCell>
                    <TableCell>{stockPurchaseCost}</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                    </div>
                 :
                <div></div>
            }
            <div className="font-bold mt-6">Expired Stock Report</div>
            {
                expStock.length > 0 ?
                    <div>
                        <Table className="small-receipt">
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >Name</TableHead>
                    <TableHead >Description</TableHead>
                    <TableHead >Unit</TableHead>
                    <TableHead >Qty</TableHead>
                    <TableHead >Exp</TableHead>
                    <TableHead >Total Amount</TableHead>
                    <TableHead >Total Purchase</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expStock.map((stock, index) => (
                    <TableRow key={stock.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>{stock.description}</TableCell>
                        <TableCell className="font-medium">{stock.unitsPurchased}</TableCell>
                        <TableCell className="font-medium">{stock.unitAmount}</TableCell>
                        <TableCell className="font-medium">{date(stock.expiryDate)}</TableCell>
                        <TableCell className="font-medium">{(stock.unitAmount * stock.unitsPurchased).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{stock.totalPurchaseAmount}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow className="font-bold">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell colSpan={3}>{totalUnitStock}</TableCell>
                    <TableCell>{totalLostToExpiredStock.toLocaleString()}</TableCell>
                    <TableCell >{purchaseCost}</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                    <div className="text-sm my-4">
                        <div className="font-bold">Stock Report Summary: </div>
                        <div>{totalUnitStock} in total of stock expired, {totalLostToExpiredStock.toLocaleString()} in total lost to expited stock</div>
                        <div className="grid grid-cols-3 p-2 bg-muted font-bold mt-2">
                            <div>Stock Cash In Hand</div>
                            <div>UGX {(totalStockSales - totalLostToExpiredStock).toLocaleString()}</div>
                        </div>
                    </div>
                    </div>
                 :
                <div></div>
            }
            <div className="flex justify-between my-8 bg-green-600 text-green-100 p-2">
                <div>1.2</div>
            <div className="text-lg font-bold tracking-tight">EXPENSES</div></div>            
            <div className="font-bold mt-6">Bills Report</div>
            {
                bills.length > 0 ?
                    <div>
                        <Table className="small-receipt">
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >Name</TableHead>
                    <TableHead >Description</TableHead>
                    <TableHead >Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expense.map((bill, index) => (
                    <TableRow key={bill.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{bill.name}</TableCell>
                        <TableCell>{bill.description}</TableCell>
                        <TableCell className="font-medium">{bill.amount.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow className="font-bold">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>{totalExpenses.toLocaleString()}</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                    <div className="text-sm my-4">
                        <div className="font-bold">Expenses Report Summary: </div>
                        <div className="grid grid-cols-3 p-2 bg-muted font-bold mt-2">
                            <div>Total Expenses</div>
                            <div>UGX {totalExpenses.toLocaleString()}</div>
                        </div>
                    </div>
                    </div>
                 :
                <div></div>
            }
            <div className="flex justify-between my-8 bg-green-600 text-green-100 p-2">
                <div>1.3</div>
            <div className="text-lg font-bold tracking-tight">INVOICES</div></div>            
            <div className="font-bold mt-6">paid Invoices Report</div>
            {
                paidInvoices.length > 0 ?
                    <div>
                        <Table className="small-receipt">
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >Name</TableHead>
                    <TableHead >Quantity</TableHead>
                    <TableHead >Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paidInvoices.map((invoice, index) => (
                    <TableRow key={invoice.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{invoice.product.name}</TableCell>
                        <TableCell>{invoice.quantity}</TableCell>
                        <TableCell className="font-medium">{invoice.total}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow className="font-bold">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>{totalInvoiceAmount.toLocaleString()}</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                    <div className="text-sm my-4">
                        <div className="font-bold">Paid Invoices Summary: </div>
                        <div className="grid grid-cols-3 p-2 bg-muted font-bold mt-2">
                            <div>Total Paid Invoices Amount</div>
                            <div>UGX {totalInvoiceAmount.toLocaleString()}</div>
                        </div>
                    </div>
                    </div>
                 :
                <div></div>
            }
            <div className="flex justify-between my-8 bg-green-600 text-green-100 p-2">
                <div>1.4</div>
            <div className="text-lg font-bold tracking-tight">CONCLUSION</div></div>            
            <div className="font-bold mt-6">Report Overview</div>
            <div className="text-sm my-4">
                        <div className="grid grid-cols-3 p-2 bg-muted font-bold mt-2">
                            <div>Overall Sales</div>
                            <div>UGX {((totalStockSales - totalLostToExpiredStock) - totalExpenses + totalInvoiceAmount).toLocaleString()}</div>
                        </div>
                    </div>
        </div>
    )
}