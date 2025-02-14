import { Pill } from "lucide-react";
import { Stock } from "../stock/dataColumns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date } from "@/app/services/services";
import { rowsSelected } from "./stepWise";


export default function Invoice(props: {selectedRows: Stock[], form: {address: string,
    paymentMeans: string,
    user: number,
    invoiceStatus: string,
    paymentID: string,
    }}){

    let curr: string | undefined = ""

    const calculateTotal = (row: Stock) => {
        let total = 0
        total = parseFloat(row.unitAmount.toString()) * parseFloat(row.unitsPurchased.toString())
        curr = row.currency?.code
        return total
    }

    // Calculate the overall total for the table
    const calculateOverallTotal = () => {
      return props.selectedRows.reduce((acc, row: Stock) => acc + calculateTotal(row), 0);
    };
  
    const overallTotal = calculateOverallTotal();

    const tax = 0
    const total = overallTotal + (tax/100 * overallTotal)

    return(
        <div className="sm:p-12 rounded-md border">
            <div className="flex justify-between border-b pb-6">
                <Pill size={40} className="text-primary"/>
                <div className="text-3xl font-bold tracking-tight">INVOICE</div>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col text-sm mt-8">
                    <p className="font-bold">Billed To:</p>
                    <p>{props.form.address}</p>
                </div>
                <div className="flex flex-col text-sm mt-8 w-[100px]">
                    <p>{Date().toString()}</p>
                </div>
            </div>
            <div>
                <div className="mt-8 text-sm font-bold">Purchase</div>
                <Table>
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >OrderDate</TableHead>
                    <TableHead >Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>PackagingUnit</TableHead>
                    <TableHead className="text-right">UnitPrice</TableHead>
                    <TableHead className="text-right">UnitsPurchased</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {props.selectedRows.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{date(row.orderDate)}</TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.packaging.unit}</TableCell>
                        <TableCell className="text-right">{row.unitAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.unitsPurchased}</TableCell>
                        <TableCell className="text-right">{calculateTotal(row).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
                <div className="text-sm">
                    <div className="grid grid-cols-4 bg-muted justify-end p-2">
                    <div className=" text-right col-span-3">SubTotal</div>
                    <div className="text-right col-span-1">{overallTotal.toLocaleString()}</div>
                    </div>
                    <div className="bg-background grid grid-cols-4 p-2">
                    <div className=" text-right col-span-3">Tax</div>
                    <div className="text-right col-span-1">{tax}%</div>
                    </div>
                    <div className="grid grid-cols-4 bg-muted p-2">
                    <div className=" text-right font-bold col-span-3">Total </div>
                    <div className="text-right col-span-1"><span className="mr-1">{curr}</span>{total.toLocaleString()}</div>
                    </div>
                </div>
                </div>
                <div className="flex flex-col py-4 text-sm border-t mt-12">
                    <p className="font-bold">Payment Details</p>
                    <p>{props.form.paymentID}</p>
                    <p>{props.form.paymentMeans}</p>
                </div>
        </div>
    )
}