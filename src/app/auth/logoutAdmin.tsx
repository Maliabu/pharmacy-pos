"use client"

import { Button } from "@/components/ui/button"
import { logout } from "@/server/fetch.actions"
import { redirect } from "next/navigation"
import { tokenise } from "../services/services"

export default function LogoutAdmin(){
    async function Logout(){
        setTimeout(() => {
            const message = document.getElementById("submit1")
            if(message !== null){
                message.innerHTML = 'logging out...'
            }
        })
        const data = new FormData()
        data.append("email", tokenise()[2])
        const logoutUser = await logout(data)
        if(logoutUser.error == false){
            window.localStorage.setItem("token", '')
            window.localStorage.setItem("id", '')
            window.localStorage.setItem("username", '')
            window.localStorage.setItem("name", '')
            window.localStorage.setItem("email", '')
            window.localStorage.setItem("userType", '')
            redirect("/")
        } else {
            console.log(logoutUser.error)
        }
    }
    return(
        <Button id="submit1" onClick={() => Logout()} className=" w-full">Logout</Button>
    )
}