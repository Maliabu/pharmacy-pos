"use client"

import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default function LogoutAdmin(){
    function logout(){
        setTimeout(() => {
            const message = document.getElementById("submit1")
            if(message !== null){
                message.innerHTML = 'logging out...'
            }
        })
        window.localStorage.setItem("token", '')
        console.log(window.localStorage.getItem("token"))
        redirect("/")
    }
    return(
        <Button id="submit1" onClick={() => logout()} className=" w-full">Logout</Button>
    )
}