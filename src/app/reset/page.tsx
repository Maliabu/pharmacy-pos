/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import React, { JSX } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { checkEmail, loginUser, resetPassword, sendHtmlEmail } from "@/server/fetch.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { redirect } from "next/navigation"
import { currentUrl, handleDecryption, handleEncryption, tokenise } from "../services/services"
import { Eye, EyeOff, Mail, Moon, PhoneCall, Sun} from "lucide-react"
import { loginUserSchema, passwordResetSchema, resetPasswordSchema } from "@/schema/formSchemas"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { sendPasswordResetLInk } from "@/nodemailer"
import { toast } from "sonner"


export default function Page() {
    const { setTheme } = useTheme() 
    const [showPassword, setShowPassword] = useState(false);
    const [id, setId] = React.useState("")
    const [name, setName] = React.useState("")
    const [init, setInitVector] = React.useState("")
    const [urlEmail, setEmail] = React.useState("")
    const [buttonText, setButtonText] = useState("Submit");

      React.useEffect(() => {
          setId(tokenise()[3])
          if (typeof window !== "undefined") {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const email = decodeURIComponent(urlParams.get('email') || '')
            const init = decodeURIComponent(urlParams.get('init') || '')
            
            setEmail(email);
            setInitVector(init);
          }
      }, [])

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    }

    const form = useForm<z.infer<typeof passwordResetSchema>>({
        resolver: zodResolver(passwordResetSchema),
          defaultValues: {
            email: name,
            confirmPassword: "",
            encrPass: '',
            decInit: '',
            password: "",
            userId: id,
        },
    })
    if(urlEmail !== ''){
            const dec = handleDecryption(urlEmail, init)
            dec.then(async (res) => {
                if(res !== undefined){
                    const result = res
                    const check = await checkEmail(result.toString())
                    if(check.error == false && check.name !== ''){
                        setName(check.email)
                    } else {
                        setName(check.email+' doesnot exist')
                        setTimeout(() => {
                            toast("Unfortunately this account is invalid");
                        }, 1000)
                    }
                } else {
                    setTimeout(() => {
                        toast("Unfortunately this link is invalid");
                    }, 1000)
                }
            })
    }
       
      async function onSubmit(values: z.infer<typeof passwordResetSchema>) {
        setButtonText('processing...')
        if(name !== ""){
            if(values.encrPass !== "" && values.encrPass === values.confirmPassword){
            // encrypt password
            const encr = handleEncryption(values.encrPass)
            values.password = (await encr).encryptedData
            values.decInit = (await encr).initVector
          }}
          const data = await resetPassword(values)
          if(data.error == true){
            setButtonText('Password Reset Failed')
            form.setError("root", {
            "message": "Something went wrong"
            })
            setTimeout(() => {
                form.clearErrors()
            }, 5000)
          } else {
            setButtonText('Reset Success')
            form.setError("root", {
            "message": "Your password was successfully Reset"
            })
            setTimeout(() => {
                form.clearErrors()
            }, 5000)
            redirect("/")
          }

        }
        function greenLight(name: string){
            if(name.search('doesnot') == -1){
                //doesnot match
                return "text-xs text-primary p-1 rounded-md bg-green-100 flex justify-center"
            } else{
                return "text-xs text-destructive p-1 rounded-md bg-muted/80 flex justify-center"
            }
        }
    return (
        <div className="sm:p-20 sm:grid sm:grid-cols-2 back-image">
        <div className="sm:p-10 p-6 sm:rounded-l-3xl sr:rounded-t-2xl flex flex-col justify-center items-center bg-background text-muted sm:columns-1"> 
           <img src="/logo.png" alt="logo" width={300} height={100} className="hidden sm:block"/>                  
           <img src="/logo.png" alt="logo" width={200} height={100} className="sm:hidden"/>                  
        </div>
            <div className="sm:p-8 p-6 sm:px-20 sm:pb-16 sm:rounded-r-2xl sr:rounded-b-2xl bg-background/80">
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="bg-transparent shadow-none">
                    <Button variant="outline">
                    <Sun className="h-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-50" />
                    <Moon className=" h-[1.2rem] rotate-90 scale-50 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
        <div className="text-4xl tracking-tight font-bold sm:my-4 grid justify-center items-center">New Password</div>
        <div className={greenLight(name)}>Account: {name}</div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid w-full items-center">
                        <FormField
                            control={form.control}
                            name="encrPass"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                            <div className="flex justify-between cursor-pointer">
                            <Input type={showPassword ? 'text' : 'password'} id="password" placeholder="Password" {...field} className="dark:border dark:border-muted-foreground"/>
                            <p className="text-sm border ml-1 rounded-md p-2" id="see" onClick={() => togglePasswordVisibility()}>{showPassword ? <Eye size={16}/> : <EyeOff size={16}/>}</p>
                            </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                          <Input type="password" placeholder="Confirm Password" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
                </div>
                <Button className="my-4 text-sm text-white w-full" id="submit" type="submit">{buttonText}</Button>
                {form.formState.errors.root && (
                    <div className=" bg-green-200 text-primary p-2 text-center rounded-md">{form.formState.errors.root.message}</div>
                )}
                </form>
                </Form>
                </div>
    </div>
        )
}