/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { tokenise } from "@/app/services/services";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reportSchema } from "@/schema/formSchemas";
import { addNewReport } from "@/server/fetch.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function Reports(){

    const form = useForm<z.infer<typeof reportSchema>>({
        resolver: zodResolver(reportSchema),
          defaultValues: {
            monthDate: "",
            user: tokenise()[3]
        },
      })

    async function onSubmit(values: z.infer<typeof reportSchema>) {
      const app = document.getElementById('submit');
        const text = 'processing';
        if(app !== null){
          app.innerHTML = text;
        }
      const data = await addNewReport(values)
      if(data.error == true){
        form.setError("root", {
          "message": "settings not updated"
        })
      } else {
        if(app !== null){
          app.innerHTML = "Successful";
        }
        window.location.reload()
      }
    }


    return <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-6 p-4 rounded-lg">
            <div className="flex flex-row justify-between space-y-1.5 gap-10">
              <FormField
                  control={form.control}
                  name="monthDate"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Select a date of the month for generating reports</FormLabel>
                      <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger id="monthDate">
                              <SelectValue placeholder="MonthDate"/>
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem value="1">1st</SelectItem>
                              <SelectItem value="2">2nd</SelectItem>
                              <SelectItem value="3">3rd</SelectItem>
                              <SelectItem value="4">4th</SelectItem>
                              <SelectItem value="5">5th</SelectItem>
                              <SelectItem value="6">6th</SelectItem>
                              <SelectItem value="28">28th</SelectItem>
                              <SelectItem value="default">Last Day of each Month</SelectItem>
                              </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <Button type="submit" id="submit" className="mt-2">Submit</Button>
                  {form.formState.errors.root && (
                  <div className="bg-light p-2 rounded-md border border-primary text-center mt-1 text-primary w-[300px]">{form.formState.errors.root.message}</div>
                  )}
                  {form.formState.isSubmitSuccessful && (
                  <div className="border border-primary text-primary p-2 mt-1 text-center rounded-md"> settings updated successfully </div>
                  )}
              </div>
            </form>
        </Form>
        </div>
}