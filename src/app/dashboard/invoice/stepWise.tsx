/* eslint-disable @typescript-eslint/no-explicit-any */
import { addInvoiceItemsSchema, addInvoiceSchema } from "@/schema/formSchemas"
import React, { JSX } from "react"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tokenise } from "@/app/services/services"
import { z } from "zod"
import Invoice from "./invoice"
import { Button } from "@/components/ui/button"
import { Stock } from "../stock/dataColumns"
import ReactDOMServer from "react-dom/server"
import { addInvoiceItems, addNewInvoice } from "@/server/fetch.actions"

export interface rowsSelected{
    selectedRows: Stock[]
}

export default function StepWise({selectedRows}: rowsSelected) {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof addInvoiceSchema>>({
        resolver: zodResolver(addInvoiceSchema),
          defaultValues: {
            address: "",
            paymentMeans: "",
            paymentID: "",
            invoiceStatus: "",
            user: parseInt(tokenise()[3])
        },
      })
      const itemsForm = useForm<z.infer<typeof addInvoiceItemsSchema>>({
        resolver: zodResolver(addInvoiceItemsSchema),
          defaultValues: {
            invoice: 0,
            product: 0,
        },
      })

    const generatePdf = async () => {
        setLoading(true);
        // const htmlContent = '<h1>Hello, this is a PDF!</h1><p>This is the content of the PDF document.</p>';
        const htmlContent = ReactDOMServer.renderToStaticMarkup(
            <Invoice selectedRows={selectedRows} form={form.getValues()} />
          );
    
        try {
          const response = await fetch('/api/pdf', {
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
            link.download = 'invoice.pdf';
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
       
      async function onSubmit(values: z.infer<typeof addInvoiceSchema>) {  
        
        const app = document.getElementById('submit');
        const text = 'processing';
        if(app !== null){
          app.innerHTML = text;
        }
        console.log("GETTING INVOICE ID")
          const data = await addNewInvoice(values)
          if(data?.error){
            form.setError("root", {
              "message": "invoive not added"
            })
          } else {
            console.log("GOT INVOICE ID")
              const invoiceId = data.id
              selectedRows.forEach(async row => {
                itemsForm.setValue("product", parseInt(row.id))
                itemsForm.setValue("invoice", invoiceId)
                const itemForm = itemsForm.getValues()
                console.log("UPLOADING INVOICE ITEM DATA")
                //submit
                const values = await addInvoiceItems(itemForm)
                if(values.error == true){
                    form.setError("root", {
                        "message": "invoive not added"
                      })
                }
              })
              console.log("GENERATING PDF")
              generatePdf()
                if(app !== null){
                app.innerHTML = "Successful";
                }
            }
        }

    const _next = () => {
        let currStep = currentStep
        const address = form.getValues("address")
        if(address == ""){
            const app = document.getElementById('address');
            const text = 'please provide an address';
            if(app !== null){
                app.style.display = 'block'
                app.innerHTML = text;
            }
        } else {
        currStep = currentStep + 1
        setCurrentStep(currStep)}
    }
    const _prev = () => {
        let currStep = currentStep
        currStep = currentStep - 1
        setCurrentStep(currStep)
    }
    function nextButton() {
        const currStep = currentStep;
        if (currStep === 1) {
            return ( 
                <div className="p-2 bg-primary text-lime-200 text-center rounded-md mt-4 w-full cursor-pointer"
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
        if(currStep === 2){
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
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-8 p-6">
            <div className = 'row py-4 justify-content-center' >
            <Step1 currentStep = { currentStep }
            button = { nextButton() }
            form={form}
            /> 
            <Step2 currentStep = { currentStep }
            prev = { nextButton() }
            selectedRows={selectedRows}
            form={form.getValues()}
            /> </div>
            {currentStep===2 && <Button type="submit" onClick={() => onSubmit(form.getValues())} id="submit" disabled={loading} className="mx-1">
            {loading ? 'Generating PDF...' : 'Generate PDF'}
            </Button>}
      </form>
      </Form>
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
        <div className="text-2xl font-bold tracking-tight">Add Invoice Details</div>
        <div className="text-sm text-muted-foreground">Atleast an address is required to generate the invoice</div>
        <div className="grid items-center gap-2 mt-4">
          <div className="grid gap-2">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="address"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Address</FormLabel>
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
                  name="paymentMeans"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Payment means</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="cash, transfer" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="paymentID"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Payment Unique ID</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="payment id" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 hidden">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={props.form.control}
                  name="invoiceStatus"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Paid or Pending payment</FormLabel>
                      <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger id="status">
                              <SelectValue placeholder="Status"/>
                              </SelectTrigger>
                              <SelectContent position="popper" className=" font-[family-name:var(--font-futura)]">
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
        </div>
            <div>{props.button}</div>
            <div id="address" style={{"display": 'none'}} className="border border-primary text-primary p-2 text-center rounded-md mt-2">hey</div>
        </div>
    );
}

function Step2(props:{currentStep: number, prev: JSX.Element, form: {address: string,
    paymentMeans: string,
    user: number,
    invoiceStatus: string,
    paymentID: string,
    }, selectedRows: Stock[]}) {
    if (props.currentStep !== 2) {
        return null
    }
    return (<div className="flex">
        <Invoice selectedRows={props.selectedRows} form={props.form}/>
        <div>
        <div>{props.prev}</div>
        </div>
    </div>);
    }