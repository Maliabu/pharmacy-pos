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
import { addNewNotification, addNewPackaging} from "@/server/fetch.actions"
import { addNotificationSchema } from '@/schema/formSchemas'
import { tokenise } from "@/app/services/services"

export default function AddNotification() {

    const form = useForm<z.infer<typeof addNotificationSchema>>({
      resolver: zodResolver(addNotificationSchema),
        defaultValues: {
            notification: "",
            from: parseInt(tokenise()[3]),
            status: 'new'
      },
    })
     
    async function onSubmit(values: z.infer<typeof addNotificationSchema>) {
      
      const app = document.getElementById('submit');
      const text = 'processing';
      if(app !== null){
        app.innerHTML = text;
      }

        const data = await addNewNotification(values)
        if(data?.error){
          form.setError("root", {
            "message": "Notification not added"
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
      <div className="text-2xl font-bold tracking-tight">Add a Notification</div>
      <div className="text-sm mb-6 text-muted-foreground">This goes out to all users for now.</div>
          <div className="grid sm:grid-cols-3 gap-2">
              <div className="flex flex-col space-y-1.5">
              <FormField
                  control={form.control}
                  name="notification"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Tell users what you have to!</FormLabel>
                      <FormControl>
                          <Input 
                          type="text" 
                          placeholder="for example: merry christmas. happy holidays" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </div>
        <Button id="submit" className="my-4" type="submit">Add Notification</Button>
        {form.formState.errors.root && (
          <div className="bg-light p-2 rounded-md">{form.formState.errors.root.message}</div>
        )}
        {form.formState.isSubmitSuccessful && (
          <div className="border border-primary text-primary p-2 text-center rounded-md"> Notification added successfully </div>
        )}
      </form>
      </Form>
        </div>
  )
}
