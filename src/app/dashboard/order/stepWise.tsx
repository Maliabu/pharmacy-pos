/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { addInvoiceItemsSchema, addInvoiceSchema, addReceipt, search } from "@/schema/formSchemas"
import React, { JSX, useEffect } from "react"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { fetcher, tokenise } from "@/app/services/services"
import { z } from "zod"
import Invoice from "../invoice/invoice"
import { Button } from "@/components/ui/button"
import { Stock } from "../stock/dataColumns"
import ReactDOMServer from "react-dom/server"
import { addInvoiceItems, addNewInvoice, addReceiptData, logActivity, newReceipt } from "@/server/fetch.actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useSWR from "swr"
import Receipt from "./receipt"
import { db } from "@/drizzle/db"
import { receiptTable, stockTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import SelectSearch from "@/app/services/selectSearch"


export default function StepWise() {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false);
    
    const [rows, setRows] = useState<{ product: string; quantity: number; receipt: number }[]>([]);
    const form = useForm<z.infer<typeof addReceipt>>({
      resolver: zodResolver(addReceipt),
        defaultValues: {
          product: "",
          quantity: 1,
          receipt: 0
      },
    })
    const searchForm = useForm<z.infer<typeof search>>({
      resolver: zodResolver(search),
        defaultValues: {
          search: ""
      },
    })
      let products: Stock[] = []
      const { data, error } = useSWR("/api/stock", fetcher);
      if(data){
          products = data
      }

    let classname = 'visible'
    console.log(form.getValues())
  
    // Handle row deletion
    const addRow = () => {
        if(form.getValues("product") == ''){
            const add = document.getElementById("add")
            if(add !== null){
                add.innerHTML = "Please select a product"
                setTimeout(() => {
                    add.innerHTML = "Add row to Receipt"
                }, 2000)
            }
        }
        else{
            setRows((prevRows) => [
            ...prevRows,
            { product: form.getValues("product"), quantity: form.getValues("quantity"), receipt: form.getValues("receipt")},
            ]);
        }
    };

    // Handle row deletion
    const handleDeleteRow = (index: number) => {
        setRows((prevRows) => prevRows.filter((_, i) => i !== index));
      };

    // Get the product name based on productId
    const getProductNameById = (productId: string) => {
        const Products = products;
        const Product = products.find((p) => p.id.toString() === productId);
        return [Product ? Product.name : '', Product?Product.unitAmount.toString(): '0']
    };

    const searchParam = searchForm.getValues("search")

    function searchResults(){
      if(searchParam === ""){
        return (
            <div>
                <p className="small text-start">0 search results found</p>
            </div>
        )
      } else {
        console.log(searchParam, products)
        if(data) {
        const SearchFilter = products.filter((item)=>{ if(item.name.toLowerCase().includes(searchParam.toLowerCase())){return <p key={item.id}>{item.name}</p>}})
        const myFinalSearch = SearchFilter.map((item) => {return <div key={item.id} className="grid grid-cols-1 p-4 bg-muted rounded-md mt-1"><p>{item.name}</p></div>})
        return(
            <div className="pt-4 text-sm p-2 rounded-md bg-muted">{myFinalSearch}</div>
        )}
        else{
          return <div className="text-sm">loading products...</div>
        }
      }
    }

    const generatePdf = async () => {
        setLoading(true);
        classname = 'hidden'
        // const htmlContent = '<h1>Hello, this is a PDF!</h1><p>This is the content of the PDF document.</p>';
        const htmlContent = ReactDOMServer.renderToStaticMarkup(
            <Receipt rows={rows} getProductNameById={getProductNameById} classname={classname}/>
        );
    
        try {
          const response = await fetch('/api/receipt', {
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
            link.download = 'receipt.pdf';
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
       
    async function onSubmit(values: z.infer<typeof addReceipt>) {
        const app = document.getElementById('submit');
        const text = 'processing';
        if(app !== null){
          app.innerHTML = text;
        }
        const userId = tokenise()[3]

        const receipt = await newReceipt(userId)
        if(receipt != 0){
            for(const row of rows){
                await addReceiptData(row, userId, receipt)
            }
        }
        await logActivity("Generated a Receipt "+receipt, userId)
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
                Proceed to Receipt 
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
    return ( 
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-8 p-6">
            <div className = 'row py-4 justify-content-center' >
            <Step1 currentStep = { currentStep }
            button = { nextButton() }
            products = {products}
            form={form}
            rows={rows}
            getProductNameById={getProductNameById}
            handleDeleteRow={handleDeleteRow}
            addRow = {addRow}
            /> 
            <Step2 currentStep = { currentStep }
            getProductNameById={getProductNameById}
            prev = { nextButton() }
            rows={rows}
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
          <div className="border border-primary text-primary p-2 mt-1 text-center rounded-md"> Receipt generated successfully </div>
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
        products: Stock[]
        getProductNameById: (productId: string) => string[]
        rows: {product: string, quantity: number}[]
        handleDeleteRow: (index: number) => void
        addRow: () => void
        button:JSX.Element | null}) {
    if (props.currentStep !== 1) {
        return null
    }
    return ( 
        <div>
      <div className='text-2xl font-bold tracking-tight'>Add Products to Receipt</div>
        <div className="flex flex-col space-y-1.5 mt-2">
              <FormField
                  control={props.form.control}
                  name="product"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Select a product to add to Receipt</FormLabel>
                      <FormControl>
                      <SelectSearch products={props.products} fields={field}/>
                          {/* <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                              <SelectTrigger id="product">
                              <SelectValue placeholder="Product"/>
                              </SelectTrigger>
                              <SelectContent>
                              {
                                  props.products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
                                  ))
                                }
                                </SelectContent>
                          </Select> */}
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-2">
              <FormField
                  control={props.form.control}
                  name="quantity"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>How many products to add</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
        <div className='mt-2 p-2 rounded-md border text-center cursor-pointer border-primary text-primary' onClick={() => props.addRow()} id="add">Add Row</div>
      <div className='text-lg font-bold tracking-tight my-6'>Receipt Summary</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Unit Amount</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {props.rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{props.getProductNameById(row.product[0])[0]}</TableCell>
                <TableCell>{props.getProductNameById(row.product[0])[1]}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.quantity * parseInt(props.getProductNameById(row.product[0])[1])}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => props.handleDeleteRow(index)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            <div>{props.button}</div>
            <div id="address" style={{"display": 'none'}} className="border border-primary text-primary p-2 text-center rounded-md mt-2">hey</div>
    </div>
    );
}

function Step2(props:{
    currentStep: number, 
    prev: JSX.Element,
    getProductNameById: (productId: string) => string[]
    rows: {product: string, quantity: number}[]
    classname: string
    }) {
    if (props.currentStep !== 2) {
        return null
    }
    return (<div className="flex">
        <div>
            <Receipt rows={props.rows} getProductNameById={props.getProductNameById} classname={props.classname}/>
        <div>{props.prev}</div>
        </div>
    </div>);
    }