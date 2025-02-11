"use client"
import { tokenise } from "@/app/services/services";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Profile(){
    const [token, setToken] = useState("")
    useEffect(() => {
        setToken(tokenise()[0][0].toUpperCase())
    }, [])
    return(
        <Link href="/dashboard/account">
          <div className="flex flex-row justify-between rounded-md">
            <div className="h-10 w-10 bg-primary text-background grid font-bold rounded-full justify-center items-center">{token.toUpperCase()}</div>

        </div>
        </Link>
    )
}