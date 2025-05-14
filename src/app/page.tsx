/* eslint-disable @next/next/no-img-element */
"use client"

import { Mail, PhoneCall } from "lucide-react"
import StepWise from "./stepWise"
// import logo from '@/app/assets/next.svg'

export default function Login(){
    return( 
        <div>
    <StepWise/>
    <div className="text-xs sm:p-6 p-4 absolute bottom-0 bg-background w-full sm:flex sm:justify-between">
                    &copy;copyright.newfeelventures.com@{new Date().getFullYear()}
                    <div className="flex sm:block hidden"><Mail size={16} className="mr-3"/> | support@newfeelventures.com</div>
                    <div className="flex sm:block hidden"><PhoneCall size={16} className="mr-3"/> | 0701062621</div>
                    <div className="">AllRightsReserved</div>
                    </div>
        </div>
    )
}