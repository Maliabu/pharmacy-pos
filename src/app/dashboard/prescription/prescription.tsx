"use client"
/* eslint-disable @next/next/no-img-element */

import { date } from "@/app/services/services";
import Image from "next/image";
import parse from 'html-react-parser'

export default function Prescription(props: {classname: string, user: string, form: {physicalAddress: string,
    name: string,
    userId: number,
    age: string,
    sex: string,
    testsDone: string,
    prescription: string,
    diagnosis: string,
    phone: string
    }}){

    return(
        <div className="sm:p-8 rounded-md sm:w-[800px]">
            <div className={props.classname}>
            <Image src="https://newfeelventures.com/logo.png" alt="logo" width={200} height={100} unoptimized/>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col text-sm mt-8">
                    <p>{props.form.name}</p>
                    <p>{props.form.age} - {props.form.sex}</p>
                    <article className="text-wrap">
                    <p className="">{props.form.physicalAddress}</p></article>
                    <p>{props.form.phone}</p>

                </div>
                <div className="flex flex-col text-sm mt-8">
                    <p>{props.user}</p>
                    <p>{date(Date())}</p>
                </div>
            </div>
            <div>
                    <div className=" font-bold mt-12">TEST DONE</div>
                    <div className="text-sm">{props.form.testsDone}</div>
                    <div className="font-bold mt-4 pt-4 border-t">DIAGNOSIS</div>
                    <div className="text-sm">{props.form.diagnosis}</div>
                </div>
                <div className="flex flex-col py-2 border-t mt-6">
                    <p className="font-bold">PRESCRIPTION</p>
                    <div className="text-sm">{parse(props.form.prescription)}</div>
                </div>
                <p className="text-sm text-center mt-2 py-4 border-t"><span className="font-bold">Hospital Tel:</span> 0769209573 / 0706750021 <br/><span className="font-bold">Dr Joseph Tel:</span> 0779011362 / 0702812100</p>
        </div>
    )
}