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
import { addNewBill, addSuppliers, addUsers, addvendors } from "@/server/fetch.actions"
import { addBill, addSupplier, addUserSchema, addVendor } from '@/schema/formSchemas'
import { fetcher, tokenise } from "@/app/services/services"
import useSWR from "swr"

export default function AddBill() {

    const form = useForm<z.infer<typeof addBill>>({
      resolver: zodResolver(addBill),
        defaultValues: {
          name: "",
          description: "",
          status: "",
          currency1: "",
          currency: 0,
          amount: 0,
          userId: tokenise()[3]
      },
    })
    console.log(form.getValues())
    const status = [
        {
            id: 1,
            status: "paid"
        },
        {
            id: 2,
            status: "pending"
        }
    ]

    function Currency(){
        const currencies: any[] = []
        const { data, error } = useSWR("/api/currency", fetcher);
        if(data){
            currencies.push(data)
            return data
        } else return []
    }
     
    async function onSubmit(values: z.infer<typeof addBill>) {  
      
      const app = document.getElementById('submit');
      const text = 'processing';
      if(app !== null){
        app.innerHTML = text;
      }

        const data = await addNewBill(values)
        if(data?.error){
          form.setError("root", {
            "message": "bill not added"
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
      <div className="text-2xl font-bold tracking-tight">Add New Bill</div>
        <div className="grid items-center gap-2 mt-4">
          <div className="grid sm:grid-cols-3 gap-2">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="What bill?" {...field} />
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
                          <Input type="text" placeholder="Describe what you are paying for?" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Status * (paid or pending - payment?)</FormLabel>
                      <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                              <SelectTrigger id="status">
                              <SelectValue placeholder="status"/>
                              </SelectTrigger>
                              <SelectContent position="popper" className=" font-[family-name:var(--font-futura)]">
                                {
                                  status.map((status) => (
                                    <SelectItem key={status.id} value={status.status}>{status.status}</SelectItem>
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
          <div className="flex flex-col mt-4 space-y-1.5">
              <FormField
                  control={form.control}
                  name="currency1"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                              <SelectTrigger id="currency1">
                              <SelectValue placeholder="currency"/>
                              </SelectTrigger>
                              <SelectContent>
                                {
                                  Currency().map((currency:{id:number, currency:string}) => (
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
          <div className="flex flex-col space-y-1.5 mt-4">
              <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="amount" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
        </div>
        <Button id="submit" className="my-4" type="submit">Add Bill</Button>
        {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 text-center rounded-md"> Bill added successfully </div>
        )}
      </form>
      </Form>
        </div>
  )
}
