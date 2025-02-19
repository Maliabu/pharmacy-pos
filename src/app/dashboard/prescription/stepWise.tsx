/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { addInvoiceItemsSchema, addInvoiceSchema, addPrescription } from "@/schema/formSchemas"
import React, { JSX, useEffect } from "react"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tokenise } from "@/app/services/services"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import ReactDOMServer from "react-dom/server"
import { addNewPrescription } from "@/server/fetch.actions"
import Prescription from "./prescription"
import { Textarea } from "@/components/ui/textarea"


export default function StepWise() {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof addPrescription>>({
        resolver: zodResolver(addPrescription),
          defaultValues: {
            name: "",
            age: "",
            sex: "",
            phone: "",
            physicalAddress: "",
            testsDone: "",
            diagnosis: "",
            userId: tokenise()[3]
        },
      })
    let classname = 'visible'

    const generatePdf = async () => {
        setLoading(true);
        classname = 'hidden'
        // const htmlContent = '<h1>Hello, this is a PDF!</h1><p>This is the content of the PDF document.</p>';
        const htmlContent = ReactDOMServer.renderToStaticMarkup(
            <Prescription form={form.getValues()} classname={classname} />
          );
    
        try {
          const response = await fetch('/api/prescriptions/pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ htmlContent }),
          });
    
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'prescription.pdf';
            link.click();
          } else {
            console.error('Error generating PDF:', response.statusText);
          }
        } catch (error) {
          console.error('Error generating PDF:', error);
        } finally {
          setLoading(false);
        }
      };
       
      async function onSubmit(values: z.infer<typeof addPrescription>) {
        const app = document.getElementById('submit');
        const text = 'processing';
        if(app !== null){
          app.innerHTML = text;
        }
        const data = await addNewPrescription(values)
        if(data.error == true || data.error == undefined){
          form.setError("root", {
            "message": "prescription not generated"
          })
          if(app !== null){
            app.innerHTML = "Generate PDF";
          }
        }
        if(data.error == false){
          // After all items are added, generate the PDF
          try {
            await generatePdf(); // Ensure the PDF is generated after all items are added
          } catch (error) {
            console.error("Error generating PDF:", error);
            form.setError("root", { "message": "Error generating PDF" });
          }
          if(app !== null){
            app.innerHTML = "Successful";
          }
          window.location.reload()
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
                <div className="p-2 bg-primary text-green-200 text-center rounded-md mt-4 w-full cursor-pointer"
                onClick = { _next } >
                Next 
                </div>        
            )
        }
        else {
            return ( 
                <div className="p-2 border border-primary m-1 text-primary text-center rounded-md text-sm w-full cursor-pointer"
                onClick = { _prev } >
                Previous 
                </div>        
            )
        }
    }
    function submitButton(){
        const currStep = currentStep
        if(currStep == 2){
            return(
            <Button type="submit" id="submit" disabled={loading} className="mx-1">
            {loading ? 'Generating PDF...' : 'Generate PDF'}
            </Button>
            
            )
        } else {
            return <></>
        }
    }
    return ( 
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-6 p-4">
            <div className = 'row py-4 justify-content-center' >
            <Step1 currentStep = { currentStep }
            button = { nextButton() }
            form={form}
            /> 
            <Step2 currentStep = { currentStep }
            prev = { nextButton() }
            form={form.getValues()}
            classname={classname}
            /> </div>
            {currentStep==2 && <Button type="submit" id="submit" disabled={loading} className="mx-1">
            {loading ? 'Generating PDF...' : 'Generate PDF'}
            </Button>
            }
            {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md border border-primary text-center mt-1 text-primary w-[300px]">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 mt-1 text-center rounded-md"> prescription generated successfully </div>
        )}
        </form>
        </Form>
      </div>
        )
}

function Step1(props:
    {
        currentStep: number,
        form: any, 
        button:JSX.Element | null}) {
    if (props.currentStep !== 1) {
        return null
    }
    return ( 
        <div>
        <div className="text-2xl font-bold tracking-tight">Add Prescription Details</div>
        <div className="grid items-center gap-2 mt-4">
        <div className="text-sm text-muted-foreground">All Patient Details Required</div>
        <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                          <Input
                          type="text" 
                          placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="age"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="age..." {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="phone"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="+256..." {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="sex"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger id="sex">
                              <SelectValue placeholder="Sex"/>
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem value="M">Male</SelectItem>
                              <SelectItem value="F">Female</SelectItem>
                              </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
          <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="physicalAddress"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Physical Address</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="plot and street, city, zone..." {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
        </div>
        <div className="text-sm text-muted-foreground mt-4">Test and prescription details required</div>
        <div>
            <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="testsDone"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Tests Done</FormLabel>
                      <FormControl>
                          <Textarea placeholder="Tests done" {...field} />                      
                          </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="diagnosis"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                      <Textarea placeholder="Diagnosis" {...field} />                      
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="prescription"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Prescription</FormLabel>
                      <FormControl>
                      <Textarea placeholder="prescription" {...field} />                      
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
        </div>

            <div>{props.button}</div>
            <div id="address" style={{"display": 'none'}} className="border border-primary text-primary p-2 text-center rounded-md mt-2">hey</div>
        </div>
    );
}

function Step2(props:{currentStep: number, prev: JSX.Element, form: {physicalAddress: string,
    age: string,
    userId: string,
    sex: string,
    name: string,
    testsDone: string,
    diagnosis: string,
    prescription: string,
    },
    classname: string}) {
    if (props.currentStep !== 2) {
        return null
    }
    return (<div className="">
        <Prescription form={props.form} classname={props.classname}/>
        <div>
        <div>{props.prev}</div>
        </div>
    </div>);
    }