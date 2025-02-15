/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addSuppliers } from "@/server/fetch.actions"
import { addSupplierSchema } from '@/schema/formSchemas'
import { tokenise } from "@/app/services/services"

export default function AddSupplier() {

    const form = useForm<z.infer<typeof addSupplierSchema>>({
      resolver: zodResolver(addSupplierSchema),
        defaultValues: {
          name: "",
          email: "",
          phone: "",
          physicalAddress: "",
          token: "",
          userId: tokenise()[3]
        },
    })
     
    async function onSubmit(values: z.infer<typeof addSupplierSchema>) {  
      
      const app = document.getElementById('submit');
      const text = 'processing';
      if(app !== null){
        app.innerHTML = text;
      }

        const data = await addSuppliers(values)
        if(data?.error){
          form.setError("root", {
            "message": "supplier not added"
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
      <div className="text-2xl font-bold tracking-tight">Add New Supplier</div>
        <div className="grid items-center gap-2 mt-4">
          <div className="grid sm:grid-cols-3 gap-2">
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
                          placeholder="Supplier Name" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
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
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="+256 " {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
          <div>
          <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="physicalAddress"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Physical Address</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="physical address" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="unique Supplier Identifier" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
        </div>
        <Button id="submit" className="my-4" type="submit">Add Supplier</Button>
        {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 text-center rounded-md"> Supplier added successfully </div>
        )}
      </form>
      </Form>
        </div>
  )
}
