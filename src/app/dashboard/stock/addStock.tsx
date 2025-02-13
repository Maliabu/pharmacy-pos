/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addNewStock, addSuppliers, addUsers } from "@/server/fetch.actions"
import { addStock, addSupplier, addUserSchema } from '@/schema/formSchemas'
import { DatePicker } from "@/app/services/datePicker"
import { fetcher, tokenise } from "@/app/services/services"
import Packaging from "../packaging/fetchPackaging"
import useSWR from "swr"

export default function AddStock() {
    const [currency, setCurrency] = React.useState("");
    const [vendor, setVendor] = React.useState("");
    const [supplier, setSupplier] = React.useState("");
    const [status, setStatus] = React.useState("");

    const form = useForm<z.infer<typeof addStock>>({
      resolver: zodResolver(addStock),
        defaultValues: {
          name: "",
          description: "",
          stockStatus: status,
          supplier: 0,
          vendor: 0,
          paymentMeans: "",
          orderDate: new Date(),
          expiryDate: new Date(),
          currency: 0,
          currency1: currency,
          supplier1: supplier,
          vendor1: vendor,
          unitAmount: 0,
          unitsPurchased: 0,
          packaging: 0,
          packaging1: "",
          userId: tokenise()[3]
      },
    })
    
    const handleStatusChange = (value: string) => {
        setStatus(value)
        form.setValue("stockStatus", value); // Update form state using setValue
    };
    const handleCurrencyChange = (value: string) => {
        setCurrency(value)
        form.setValue("currency1", value); // Update form state using setValue
    };
    const handleSupplierChange = (value: string) => {
        if(value!=="reset"){
            setSupplier(value)
            form.setValue("supplier1", value) // Update form state using setValue
            form.setValue("vendor1", ""); // Update form state using setValue
        } else {
            setSupplier("")
            form.setValue("supplier1", "") // Update form state using setValue
            form.setValue("vendor1", ""); // Update form state using setValue
        }
    };
    const handleVendorChange = (value: string) => {
        if(value!=="reset"){
            setVendor(value)
            form.setValue("vendor1", value); // Update form state using setValue
            form.setValue("supplier1", ""); // Update form state using setValue
        } else {
            setVendor("")
            form.setValue("supplier1", "") // Update form state using setValue
            form.setValue("vendor1", ""); // Update form state using setValue
        }
    };

    function Packaging(){
        const packages: any[] = []
        const { data, error } = useSWR("/api/packaging", fetcher);
        if(data){
            packages.push(data)
            return data
        } else return []
    }
    function Currency(){
        const currencies: any[] = []
        const { data, error } = useSWR("/api/currency", fetcher);
        if(data){
            currencies.push(data)
            return data
        } else return []
    }
    function Supplier(){
        const suppliers: any[] = []
        const { data, error } = useSWR("/api/supplier", fetcher);
        if(data){
            suppliers.push(data)
            return data
        } else return []
    }
    function Vendor(){
        const vendors: any[] = []
        const { data, error } = useSWR("/api/vendor", fetcher);
        if(data){
            vendors.push(data)
            return data
        } else return []
    }

    async function onSubmit(values: z.infer<typeof addStock>) {  
      
      const app = document.getElementById('submit');
      const text = 'processing';
      if(app !== null){
        app.innerHTML = text;
      }

        const data = await addNewStock(values)
        if(data?.error){
          form.setError("root", {
            "message": "stock not added"
          })
        } else {
          if(app !== null){
            app.innerHTML = "Successful";
          }
          window.location.reload()
        }
    }

  return (
    <div className="p-4 pb-0">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-8 p-6">
      <div className="text-2xl font-bold tracking-tight">Add New Stock</div>
        <div className="grid items-center mt-4">
        <div className="text-sm text-muted-foreground bg-muted p-2 bg-muted rounded-md">Product Information</div>
          <div className="grid sm:grid-cols-3 gap-2 sm:mt-4">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="What product is this" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="packaging1"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Select its Packaging</FormLabel>
                      <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger id="Packaging">
                              <SelectValue placeholder="Packaging"/>
                              </SelectTrigger>
                              <SelectContent>
                              {
                                  Packaging().map((packaging: {id:number, material:string, manufacturer:string}) => (
                                    <SelectItem key={packaging.id} value={packaging.manufacturer}>{packaging.material} - {packaging.manufacturer}</SelectItem>
                                  ))
                                }
                                </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
          <div className="flex flex-col space-y-1.5 mt-4">
              <div className="text-sm">Order Date</div>
              <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                      <FormItem>
                      <FormControl
                      >
                          <DatePicker field={field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
              <div className="text-sm">Expiry Date</div>
              <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                      <FormItem>
                      <FormControl
                      >
                          <DatePicker field={field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div><div className="flex flex-col space-y-1.5 mt-4">
              <div className="text-sm">Status of Product</div>
              <FormField
                  control={form.control}
                  name="stockStatus"
                  render={({ field }) => (
                      <FormItem>
                      <FormControl>
                          <Select 
                          onValueChange={handleStatusChange}
                          defaultValue={field.value}>
                              <SelectTrigger id="stockStatus">
                              <SelectValue placeholder="active, quarantine, safety"/>
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem key="active" value="active">Active</SelectItem>
                              <SelectItem key="quarantine" value="quarantine">Quarantive</SelectItem>
                              <SelectItem key="safety" value="safety">Safety</SelectItem>
                            </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
          <div className="text-sm text-muted-foreground mt-4 p-2 bg-muted rounded-md">Supplier and Vendor Information</div>
          <div className="grid sm:grid-cols-3 sm:gap-2 sm:mt-4">
            <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="supplier1"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Select a supplier</FormLabel>
                      <FormControl>
                          <Select 
                          onValueChange={handleSupplierChange}
                          defaultValue={field.value} 
                          disabled={form.getValues("vendor1")==""?false:true}>
                              <SelectTrigger id="supplier1">
                              <SelectValue placeholder="Supplier"/>
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem key="sup1" value="reset">Reset</SelectItem>
                              {
                                  Supplier().map((supplier:{id: number, name:string}) => (
                                    <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                                  ))
                                }
                                </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="vendor1"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Select its vendor if applicable</FormLabel>
                      <FormControl>
                          <Select
                          onValueChange={handleVendorChange}
                          defaultValue={field.value} 
                          disabled={form.getValues("supplier1")==""?false:true}>
                              <SelectTrigger id="vendor1">
                              <SelectValue placeholder="Vendor"/>
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem value="reset">Reset</SelectItem>
                              {
                                  Vendor().map((vendor:{id:number, name:string}) => (
                                    <SelectItem key={vendor.id} value={vendor.name}>{vendor.name}</SelectItem>
                                  ))
                                }
                                </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
          <div className="text-sm text-muted-foreground mt-4 bg-muted p-2 rounded-md">Purchasing Information</div>
          <div className="grid sm:grid-cols-3 sm:gap-2 sm:mt-4">
          <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="currency1"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                          <Select 
                          onValueChange={handleCurrencyChange}
                        //   onValueChange={field.onChange} 
                          defaultValue={field.value.toString()}>
                              <SelectTrigger id="currency1">
                              <SelectValue placeholder="Currency"/>
                              </SelectTrigger>
                              <SelectContent>
                                {
                                  Currency().map((currency:{id:number, currency: string}) => (
                                    <SelectItem key={currency.id} value={currency.currency}>{currency.currency}</SelectItem>
                                  ))
                                }
                                </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="unitAmount"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Cost of each unit</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="cost per unit" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="unitsPurchased"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>How many units are you Purchasing</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="units for purchase" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
        </div>
        <Button id="submit" className="my-4" type="submit">Add Stock</Button>
        {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 text-center rounded-md"> Stock added successfully </div>
        )}
      </form>
      </Form>
        </div>
  )
}
