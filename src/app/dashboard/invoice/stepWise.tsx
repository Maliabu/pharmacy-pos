/* eslint-disable @typescript-eslint/no-unused-vars */
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
            total: 0
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
        // const result = addInvoiceSchema.safeParse(values);
        // if (!result.success) {
        //   console.log(result.error.errors); // This will give you a clear insight into which fields are invalid
        // }
        if(values.paymentMeans!==""||values.paymentID!==""){
          values.invoiceStatus="paid"
        } else{
          values.invoiceStatus="pending"
        }
        const app = document.getElementById('submit');
        const text = 'processing';
        if(app !== null){
          app.innerHTML = text;
        }
        const data = await addNewInvoice(values)
        if(data.error == true || data.error == undefined){
          form.setError("root", {
            "message": "Invoive not generated"
          })
          if(app !== null){
            app.innerHTML = "Generate PDF";
          }
        }
        if(data.error == false){
          const invoiceId = data.id
          console.log(invoiceId)
          const uniqueOrders = Array.from(new Set(selectedRows.map(a => a.id)))
          .map(id => selectedRows.find(a => a.id === id));

          for( const row of selectedRows){
            itemsForm.setValue("product", parseInt(row.id))
            itemsForm.setValue("total", row.unitAmount*row.unitsPurchased)
            itemsForm.setValue("invoice", invoiceId)
                
            const itemForm = itemsForm.getValues()
            //submit
            const values = await addInvoiceItems(itemForm)
              console.log(values)
              if(values.error == true){
                  form.setError("root", {
                    "message": "invoive not added"
                  })
                }
          }
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
            {currentStep==2 && <Button type="submit" id="submit" disabled={loading} className="mx-1">
            {loading ? 'Generating PDF...' : 'Generate PDF'}
            </Button>
            }
            {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md border border-primary text-center mt-1 text-primary w-[300px]">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 mt-1 text-center rounded-md"> Invoice generated successfully </div>
        )}
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