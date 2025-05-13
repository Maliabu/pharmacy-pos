/* eslint-disable @next/next/no-img-element */
"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { loginUser } from "@/server/fetch.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { redirect } from "next/navigation"
import { handleDecryption, togglePasswordVisibility } from "./services/services"
import { EyeOff, Mail, Moon, PhoneCall, Sun} from "lucide-react"
import { loginUserSchema } from "@/schema/formSchemas"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
// import logo from '@/app/assets/next.svg'

export default function Login(){
    const { setTheme } = useTheme()

    const form = useForm<z.infer<typeof loginUserSchema>>({
        resolver: zodResolver(loginUserSchema),
          defaultValues: {
            email: "",
            password: "",
        },
      })
       
      async function onSubmit(values: z.infer<typeof loginUserSchema>) {
          //create obj
        const app = document.getElementById('submit');
        const text = 'processing';
        if(app !== null){
          app.innerHTML = text;
        }
          const data = await loginUser(values)
          const first = data[0]
          const second = data[1]
          const third = data[2]
          const forth = data[3]
          const name = data[6]
          const email = data[4]
          const username = data[5]
          const id = data[7]
          const userType = data[8]

        // decrypt password n compare
        const dec = handleDecryption(second, third)
        dec.then((res) => {
            if(res === undefined){
                if(app !== null){
                    app.innerHTML = "Login";
                }
                form.setError("root", {
                    "message": "Invalid login credentails"
                })
            }
            else if(res.toString() === values.password && forth === 'admin' || forth === 'staff'){
                if(app !== null){
                    app.innerHTML = "Successful";
                }
                form.setError("root", {
                "message": "Loggin you in..."
                })
                localStorage.setItem("token", first)
                localStorage.setItem("name", name)
                localStorage.setItem("username", username)
                localStorage.setItem("email", email)
                localStorage.setItem("id", id)
                localStorage.setItem("userType", userType)
                redirect("/dashboard/salesChart")
            } 
            else if(res.toString() !== values.password){
                if(app !== null){
                    app.innerHTML = "Login Failed";
                }
                form.setError("root", {
                "message": "invalid login credentials"
                })
            }else if(forth !== 'admin' && forth !== "staff"){
                if(app !== null){
                    app.innerHTML = "Login Failed";
                }
                form.setError("root", {
                "message": "unauthorised user login"
                })
            }else{
                if(app !== null){
                    app.innerHTML = "Login Failed";
                }
                form.setError("root", {
                "message": "contact administration"
                })
            }
            
        })
        }
    return( <div>
            <div className="sm:p-20 sm:grid sm:grid-cols-2 back-image">
            <div className="sm:p-10 p-6 sm:rounded-l-3xl sr:rounded-t-2xl flex flex-col justify-center items-center bg-background text-muted sm:columns-1"> 
               <img src="/logo.png" alt="logo" width={300} height={100} className="hidden sm:block"/>                  
               <img src="/logo.png" alt="logo" width={200} height={100} className="sm:hidden"/>                  
            </div>
                <div className="sm:p-8 p-6 sm:px-20 sm:pb-16 sm:rounded-r-2xl sr:rounded-b-2xl bg-background/70">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="bg-transparent border-none shadow-none flex justify-end w-full">
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
                  <div className="text-4xl tracking-tight font-bold sm:my-4 grid justify-center items-center">Login</div>
                  <div className="text-sm mb-4">Welcome to the Portal, Login to your account and access the dashboard, all credentials are fully authenticated</div>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid w-full items-center">
                        <div>
                            <div className="">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field}  className="dark:border dark:border-muted-foreground shadow-none"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                        </div>
                        <div className="">
                            <div className="">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" id="password" placeholder="Password" {...field} className="dark:border dark:border-muted-foreground shadow-none"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="flex justify-between cursor-pointer">
                                <p className="text-sm p-2 bg-background rounded-md flex my-2" id="see" onClick={() => togglePasswordVisibility()}><EyeOff className="mr-3" size={16}/> see password</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button className="my-4 text-white w-full" id="submit" type="submit">Login</Button>
                    {form.formState.errors.root && (
                        <div className=" bg-green-200 text-primary p-2 text-center rounded-md">{form.formState.errors.root.message}</div>
                    )}
                    <div className="text-primary text-sm flex justify-center mt-2"><Link href='/'>Forgot Password?</Link></div>
                    </form>
                    </Form>
                </div>
            </div>

            <div className="text-xs sm:p-6 p-4 fixed z-40 absolute bottom-0 bg-background/70 w-full sm:flex sm:justify-between">
                        &copy;copyright.newfeelventures.com@{new Date().getFullYear()}
                        <div className="flex sm:block hidden"><Mail size={16} className="mr-3"/> | support@newfeelventures.com</div>
                        <div className="flex sm:block hidden"><PhoneCall size={16} className="mr-3"/> | 0701062621</div>
                        <div className="">AllRightsReserved</div>
                        </div>
        </div>
    )
}