"use client"
import { tokenise } from "@/app/services/services";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Logged(){
    const [token, setToken] = useState("")
    const [name, setName] = useState("")
    useEffect(() => {
        setToken(tokenise()[0][0].toUpperCase())
        setName(tokenise()[0].split(" ")[0])
    }, [])
    return(
        <Link href="/dashboard/account">
          <div className="flex flex-row justify-between bg-muted rounded-md p-4">
            <div className="h-10 w-10 bg-primary text-background grid font-bold rounded-full justify-center items-center">{token.toUpperCase()}</div>
            <div className=" leading-4 w-2/3 text-sm">
            Hi, <span className="font-bold">{name}</span>. Welcome to the dashboard!</div>
        </div>
        </Link>
    )
}