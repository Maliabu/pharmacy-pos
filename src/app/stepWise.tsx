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
import { checkEmail, loginUser, sendHtmlEmail } from "@/server/fetch.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { redirect } from "next/navigation"
import { handleDecryption, handleEncryption } from "./services/services"
import { Eye, EyeOff, Mail, Moon, PhoneCall, Sun} from "lucide-react"
import { loginUserSchema, resetPasswordSchema } from "@/schema/formSchemas"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { sendPasswordResetLInk } from "@/nodemailer"


export default function StepWise() {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false);
    const { setTheme } = useTheme() 
    const [showPassword, setShowPassword] = useState(false);
    const [buttonText, setButtonText] = useState("Request Password Link");

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    const form = useForm<z.infer<typeof loginUserSchema>>({
        resolver: zodResolver(loginUserSchema),
          defaultValues: {
            email: "",
            password: "",
        },
      })

      const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
          defaultValues: {
            email: "",
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
          if(data.length !== 0){
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
            
        })} else{
            if(app !== null){
                app.innerHTML = "Login Failed";
            }
            form.setError("root", {
            "message": "account doesnot exist"
            })
        }
        }
        async function emailCheck(){
            const email = resetForm.getValues("email")
            const check = await checkEmail(email)
            if(check.error == false){
                resetForm.setError("root", {
                    "message": "Account doesnot exist"
                })
                setTimeout(() => {
                    resetForm.clearErrors()
                    }, 5000)
                return check.name
            } else {
                resetForm.setError("root", {
                    "message": "Account found"
                })
                setTimeout(() => {
                    resetForm.clearErrors()
                    }, 5000)
                return check.name
            }
        }


        async function onSubmit1(values: z.infer<typeof resetPasswordSchema>) {
            setButtonText('processing')
            const account = await emailCheck()
            //create obj
            if(account !== ''){
                const encr = await handleEncryption(values.email)
                const link = 'https://newfeelventures.com/reset?email='+encodeURIComponent(encr.encryptedData)+'&init='+encodeURIComponent(encr.initVector)
                const sendEmail = await sendHtmlEmail(values.email, 'Password Reset', account, link)
                if(sendEmail == true){
                    setButtonText('Email Successful')
                    resetForm.setError("root", {
                        "message": "Check your email for a password reset link"
                    })
                    setTimeout(() => {
                        resetForm.clearErrors()
                        }, 5000)
                } else{
                    setButtonText('Email Failed')
                    resetForm.setError("root", {
                        "message": "Something went wrong"
                    })
                    setTimeout(() => {
                        resetForm.clearErrors()
                        }, 5000)
                }
            }else{
                setButtonText('Email Failed')
                resetForm.setError("root", {
                    "message": "Account doesnot exist"
                })
                setTimeout(() => {
                resetForm.clearErrors()
                }, 5000)
            }
        }

    const _next = () => {
      let currStep = currentStep
      currStep = currentStep + 1 
      setCurrentStep(currStep)
    }
    const _prev = () => {
        let currStep = currentStep
        currStep = currentStep - 1
        setCurrentStep(currStep)
    }
    function nextButton() {
        const currStep = currentStep;
        if (currStep == 1) {
            return ( 
                <div
                onClick = { _next } >
                Forgot Password? 
                </div>        
            )
        }
        else {
            return ( 
                <div
                onClick = { _prev } >
                Back to Login 
                </div>        
            )
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
                <Step1 
                currentStep={currentStep}
                button = { nextButton() }
                form={form}
                onSubmit={onSubmit}
                togglePasswordVisibility={togglePasswordVisibility}
                showPassword={showPassword}
                />
                <Step2
                currentStep={currentStep}
                onSubmit={onSubmit1}
                prev = { nextButton() }
                form={resetForm}
                buttonText={buttonText}
                />
                </div>
    </div>
        )
}

function Step1(props:
    {
        currentStep: number, form: any, onSubmit: (values: z.infer<typeof loginUserSchema>) => Promise<void>,button:JSX.Element | null, togglePasswordVisibility: () => void, showPassword: boolean}) {
    if (props.currentStep !== 1) {
        return null
    }
    return (<div>
        <div className="text-4xl tracking-tight font-bold sm:my-4 grid justify-center items-center">Login</div>
              <div className="text-sm mb-4 leading-5 sm:block hidden">Welcome to the Portal, Login to your account and access the dashboard, all credentials are fully authenticated</div>
              <Form {...props.form}>
                <form onSubmit={props.form.handleSubmit(props.onSubmit)}>
                <div className="grid w-full items-center">
                    <div>
                        <div className="">
                        <FormField
                            control={props.form.control}
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
                            control={props.form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                            <div className="flex justify-between cursor-pointer">
                            <Input type={props.showPassword ? 'text' : 'password'} id="password" placeholder="Password" {...field} className="dark:border dark:border-muted-foreground shadow-none"/>
                            <p className="text-sm border ml-1 rounded-md p-2" id="see" onClick={() => props.togglePasswordVisibility()}>{props.showPassword ? <Eye size={16}/> : <EyeOff size={16}/>}</p>
                            </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </div>
                </div>
                <Button className="my-4 text-white w-full" id="submit" type="submit">Login</Button>
                {props.form.formState.errors.root && (
                    <div className=" bg-green-200 text-sm text-primary p-2 text-center rounded-md">{props.form.formState.errors.root.message}</div>
                )}
                <div className="text-primary text-sm flex justify-center mt-2"><Link href='/'>{props.button}</Link></div>
                </form>
                </Form>
    </div>
    );
}

function Step2(props:{
    currentStep: number, form: any, buttonText: string, onSubmit: (values: z.infer<typeof loginUserSchema>) => Promise<void>,
    prev: JSX.Element,
    }) {
    if (props.currentStep !== 2) {
        return null
    }
    return (<div>
              <div className="text-4xl tracking-tight font-bold my-4 grid justify-center items-center">Reset Password</div>
              <div className="text-sm mb-4 leading-5">Enter your email to receive a password reset link so you can change your password.</div>
              <Form {...props.form}>
                <form onSubmit={props.form.handleSubmit(props.onSubmit)}>
                <div className="grid w-full items-center">
                    <div>
                        <div className="">
                        <FormField
                            control={props.form.control}
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
                </div>
                <Button className="my-4 text-sm text-white w-full" id="submit1" type="submit">{props.buttonText}</Button>
                {props.form.formState.errors.root && (
                    <div className=" bg-green-200 text-primary p-2 text-center rounded-md">{props.form.formState.errors.root.message}</div>
                )}
                <div className="text-primary text-sm flex justify-center mt-2"><Link href='/'>{props.prev}</Link></div>
                </form>
                </Form>
    </div>);
    }