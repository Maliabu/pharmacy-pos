/* eslint-disable @next/next/no-img-element */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date, extractId } from "@/app/services/services";
import Image from "next/image";

export default function Receipt(props: {rows: {product: string,
    quantity: number,
    }[],
    getProductNameById: (id: string) => string[],
    classname: string
    }){
        function total(){
            let total = 0
            props.rows.forEach(row => {
                const unitAmount = props.getProductNameById(extractId(row.product))[1]
                const totalAmount = parseInt(unitAmount) * row.quantity
                total+=totalAmount
            })
            return total
        }

    return(
        <div className="p-4 rounded-md">
            <div className=" flex flex-col items-center justify-center text-center">
                <Image src="https://newfeelventures.com/logo.png" alt="logo" width={200} height={100} unoptimized className={props.classname}/>
            </div>
            <div className="flex justify-end">
                <div className="flex flex-col text-sm">
                    <p><span className="font-bold">Date: </span>{date(Date())}</p>
                </div>                
            </div>
            <p className="text-sm text-center mt-2"><span className="font-bold">Hospital Tel:</span> 0769209573 / 0706750021 <br/><span className="font-bold">Dr Joseph Tel:</span> 0779011362 / 0702812100</p>
            <div>
                <div className="mt-8 text-sm font-bold">Purchase</div>
                <Table className="small-receipt">
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
                        <TableCell>{props.getProductNameById(extractId(row.product))[0]}</TableCell>
                        <TableCell>{parseInt(props.getProductNameById(extractId(row.product))[1]).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{row.quantity}</TableCell>
                        <TableCell className="font-medium">{(parseInt(props.getProductNameById(extractId(row.product))[1]) * row.quantity).toLocaleString()}</TableCell>
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
                <div className="text-center mt-12 text-sm">
                    <p className="font-bold ">Thank you, come again</p>
                </div>
        </div>
    )
}