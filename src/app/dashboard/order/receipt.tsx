import { Pill } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date } from "@/app/services/services";

export default function Receipt(props: {rows: {product: string,
    quantity: number,
    }[],
    getProductNameById: (id: string) => string[]
    }){
        function total(){
            let total = 0
            props.rows.forEach(row => {
                const unitAmount = props.getProductNameById(row.product)[1]
                const totalAmount = parseInt(unitAmount) * row.quantity
                total+=totalAmount
            })
            return total
        }

    return(
        <div className="p-4 rounded-md">
            <div className="pb-6 flex flex-col items-center justify-center text-center">
                <Pill size={30}/>
                <div className="text-2xl font-bold tracking-tight">Light Medicare</div>
            </div>
            <div className="flex justify-end">
                <div className="flex flex-col text-sm mt-8 w-[100px]">
                    <p><span className="font-bold">Date: </span>{date(Date())}</p>
                </div>
            </div>
            <div>
                <div className="mt-8 text-sm font-bold">Purchase</div>
                <Table className="text-xs small-receipt">
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >Item</TableHead>
                    <TableHead >Unit</TableHead>
                    <TableHead >Qty</TableHead>
                    <TableHead >Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {props.rows.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{props.getProductNameById(row.product)[0]}</TableCell>
                        <TableCell>{parseInt(props.getProductNameById(row.product)[1]).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{row.quantity}</TableCell>
                        <TableCell className="font-medium">{(parseInt(props.getProductNameById(row.product)[1]) * row.quantity).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
                <div className="text-sm small-receipt">
                    <div className="grid grid-cols-5 bg-muted p-2">
                    <div className=" text-right font-bold col-span-3">Total </div>
                    <div className="text-right col-span-2"><span className="mr-1">UGX</span>{total().toLocaleString()}</div>
                    </div>
                </div>
                </div>
                <div className="text-center py-4 text-sm border-t mt-12">
                    <p className="font-bold">Thank you, come again</p>
                </div>
        </div>
    )
}