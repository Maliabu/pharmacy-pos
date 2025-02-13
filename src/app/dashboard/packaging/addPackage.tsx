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
import { addNewBill, addNewPackaging, addSuppliers, addUsers, addvendors } from "@/server/fetch.actions"
import { addBill, addPackaging, addSupplier, addUserSchema, addVendor } from '@/schema/formSchemas'
import FetchPackaging from "./fetchPackaging"
import { tokenise } from "@/app/services/services"

export default function AddPackaging() {

    const form = useForm<z.infer<typeof addPackaging>>({
      resolver: zodResolver(addPackaging),
        defaultValues: {
            manufacturer: "",
            manufacturerId: "",
            designFeatures: "",
            material: "",
            regulatoryCompliance: "",
            envConsiderations: "",
            productCompatibility: "",
            barrierProperties: "",
            userId: tokenise()[3]
      },
    })
     
    async function onSubmit(values: z.infer<typeof addPackaging>) {  
      
      const app = document.getElementById('submit');
      const text = 'processing';
      if(app !== null){
        app.innerHTML = text;
      }

        const data = await addNewPackaging(values)
        if(data?.error){
          form.setError("root", {
            "message": "packaging not added"
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-8">
      <div className="text-2xl font-bold tracking-tight">Add Type of Packging</div>
      <div className="text-sm mb-6 text-muted-foreground">Each packaging type will be used by some product in stock. so for selection purposes, a packging need be added. Please provide as much information as you can.</div>
          <div className="grid sm:grid-cols-3 gap-2">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="Who is the package manufacturer" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="manufacturerId"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Manufacturer ID</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="Anything to identify the manufacturer" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="designFeatures"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Design Features</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="How it is sealed/labeled" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
              <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Packaging Material</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="Packaging material" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
              <FormField
                  control={form.control}
                  name="regulatoryCompliance"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Regulatory Compliance</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="Who is packaging regulated by" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
              <FormField
                  control={form.control}
                  name="envConsiderations"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Enviromental Considerations</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="Is the packaging to be recycled or disposed?" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
              <FormField
                  control={form.control}
                  name="productCompatibility"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Product Compartibility</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="Is this packaging compartible with its Product?" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
              <FormField
                  control={form.control}
                  name="barrierProperties"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Barrier Properties</FormLabel>
                      <FormControl>
                          <Input type="text" placeholder="For Storage purposes. What affects this packaging? UV light? Heat?" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
              <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Unit of packaging</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="20ml bottle? 50ml pack? Specify for purchase purposes" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
        <Button id="submit" className="my-4" type="submit">Add Packaging</Button>
        {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 text-center rounded-md"> Packaging added successfully </div>
        )}
      </form>
      </Form>
        </div>
  )
}
