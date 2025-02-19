/* eslint-disable @next/next/no-img-element */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date } from "@/app/services/services";
import Image from "next/image";

export default function Prescription(props: {classname: string, form: {physicalAddress: string,
    name: string,
    userId: string,
    age: string,
    sex: string,
    testsDone: string,
    prescription: string,
    diagnosis: string,
    }}){

    return(
        <div className="sm:p-8 rounded-md sm:w-[800px]">
            <div className={props.classname}>
            <Image src="https://newfeelventures.com/logo.png" alt="logo" width={200} height={100} unoptimized/>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col text-sm mt-8">
                    <p className="font-bold">To:</p>
                    <p>{props.form.name}</p>
                    <p>{props.form.age} - {props.form.sex}</p>
                    <article className="text-wrap">
                    <p className="">{props.form.physicalAddress}</p></article>
                </div>
                <div className="flex flex-col text-sm mt-8 w-[100px]">
                <p><span className="font-bold">Date: </span>{date(Date())}</p>
                </div>
            </div>
            <div>
                <div className="mt-8 text-sm font-bold">Test</div>
                <Table className="border border-gray-300">
                <TableHeader>
                    <TableRow >
                    <TableHead className="border border-gray-300">Tets Done</TableHead>
                    <TableHead >Diagnosis</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow >
                    <TableCell className="border border-gray-300">{props.form.testsDone}</TableCell>
                    <TableCell >{props.form.diagnosis}</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                </div>
                <div className="flex flex-col py-4 text-sm border-t mt-12">
                    <p className="font-bold">Prescription</p>
                    <p>{props.form.prescription}</p>
                </div>
                <p className="text-sm text-center mt-2 py-4 border-t"><span className="font-bold">Hospital Tel:</span> 0769209573 / 0706750021 <br/><span className="font-bold">Dr Joseph Tel:</span> 0779011362 / 0702812100</p>
        </div>
    )
}