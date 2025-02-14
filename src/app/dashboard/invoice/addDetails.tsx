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
import { addNewInvoice, addUsers } from "@/server/fetch.actions"
import { addInvoiceSchema, addUserSchema } from '@/schema/formSchemas'
import { EyeOff } from "lucide-react"
import { tokenise } from "@/app/services/services"

export default function AddDetails() {

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
    const invoiceStatus = [
        {
            id: 1,
            name: "paid"
        },
        {
            id: 2,
            name: "pending"
        }
    ]
     
    async function onSubmit(values: z.infer<typeof addInvoiceSchema>) {  
      
      const app = document.getElementById('submit');
      const text = 'processing';
      if(app !== null){
        app.innerHTML = text;
      }

        const data = await addNewInvoice(values)
        if(data?.error){
          form.setError("root", {
            "message": "invoive not added"
          })
        } else {
          if(app !== null){
            app.innerHTML = "Successful";
          }
        }
    }

  return (
    <div className="p-4 pb-0">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-8 p-6">
      <div className="text-2xl font-bold tracking-tight">Add New Dashboard User</div>
        <div className="grid items-center gap-2 mt-4">
          <div className="grid sm:grid-cols-2 gap-2">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
          <div className="grid sm:grid-cols-2 gap-2">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
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
        <Button id="submit" className="my-4" type="submit">Sign Up User</Button>
        {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 text-center rounded-md"> User added successfully </div>
        )}
      </form>
      </Form>
        </div>
  )
}
