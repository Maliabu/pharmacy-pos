import { Pill } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date } from "@/app/services/services";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { invoiceItemsTable, invoiceTable } from "@/drizzle/schema";

export default async function PreviewInvoice(props: {invoiceId: number}){
    const invoices = await db.query.invoiceItemsTable.findMany({
        where: eq(invoiceItemsTable.invoice, props.invoiceId),
        with:{
            product: true
        }
    })
    const address = await db.query.invoiceTable.findMany({
        where:eq(invoiceTable.id, props.invoiceId)
    })

    // Calculate the overall total for the table
    const calculateOverallTotal = () => {
        let total = 0
      invoices.forEach((invoice) => {
        total+=invoice.total
      })
      return total
    };

    return(
        <div className="sm:p-12 rounded-md border">
            <div className="flex justify-between border-b pb-6">
                <Pill size={40} className="text-primary"/>
                <div className="text-3xl font-bold tracking-tight">INVOICE</div>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col text-sm mt-8">
                    <p className="font-bold">Billed To:</p>
                    <p>{address[0].address}</p>
                </div>
                <div className="flex flex-col text-sm mt-8 w-[100px]">
                    <p>{date(Date())}</p>
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
                    <TableHead className="text-right">UnitPrice</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{row.product.orderDate.toDateString()}</TableCell>
                        <TableCell className="font-medium">{row.product.name}</TableCell>
                        <TableCell>{row.product.description}</TableCell>
                        <TableCell className="text-right">{row.product.unitAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.quantity}</TableCell>
                        <TableCell className="text-right">{row.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
                <div className="text-sm">
                    <div className="grid grid-cols-4 bg-muted p-2">
                    <div className=" text-right font-bold col-span-3">Total </div>
                    <div className="text-right col-span-1"><span className="mr-1">UGX</span>{calculateOverallTotal()}</div>
                    </div>
                </div>
                </div>
                <div className="flex flex-col py-4 text-sm border-t mt-12">
                    <p className="font-bold">Payment Details</p>
                    <p>{address[0].paymentID}</p>
                    <p>{address[0].paymentMeans}</p>
                </div>
        </div>
    )
}