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
import { EyeOff} from "lucide-react"
import { loginUserSchema } from "@/schema/formSchemas"
// import logo from '@/app/assets/next.svg'

export default function Login(){

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
                form.setError("root", {
                "message": "invalid login credentials"
                })
            }else if(forth !== 'admin' && forth !== "staff"){
                form.setError("root", {
                "message": "unauthorised user login"
                })
            }else{
                form.setError("root", {
                "message": "contact administration"
                })
            }
            
        })
        }
    return(
            <div className="sm:p-24 p-2 sm:grid sm:grid-cols-2 sm:back-image">
            <div className="p-10 sm:rounded-l-3xl sr:rounded-t-2xl flex flex-col justify-center items-center bg-background text-muted sm:columns-1"> 
               <img src="/logo.png" alt="logo" width={300} height={100}/>                  
            </div>
                <div className="p-8 sm:p-20 sm:rounded-r-2xl sr:rounded-b-2xl bg-background/70 dark:bg-muted">
                  <div className="text-4xl tracking-tight font-bold sm:my-8 grid justify-center items-center">Login</div>
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
                                        <Input type="email" placeholder="Email" {...field} />
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
                                        <Input type="password" id="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="flex justify-between cursor-pointer">
                                <p className="text-sm p-2 bg-muted rounded-md flex my-2" id="see" onClick={() => togglePasswordVisibility()}><EyeOff className="mr-3"/> see password</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button className="my-4 text-white w-full" id="submit" type="submit">Login</Button>
                    {form.formState.errors.root && (
                        <div className="border border-primary text-primary p-2 text-center rounded-md">{form.formState.errors.root.message}</div>
                    )}
                    </form>
                    </Form>
                </div>
            </div>
    )
}