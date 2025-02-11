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
import { addUsers } from "@/server/fetch.actions"
import { addUserSchema } from '@/schema/formSchemas'
import { handleEncryption, token, username } from "../services/services"

export default function AddUser() {

    const form = useForm<z.infer<typeof addUserSchema>>({
      resolver: zodResolver(addUserSchema),
        defaultValues: {
          name: "",
          email: "",
          token: "",
          username: "",
          userType: "",
          profilePicture: '',
          password: "",
          confirmPassword: "",
          decInit: "",
          encrPass: "",
      },
    })

    const name = form.getValues("name")
    form.setValue("token", token())
    name.length > 0?form.setValue("username", username(name)[0]+String(Math.floor((Math.random() * 100) + 1))+username(name)[1]):form.setValue("username", "")
    console.log(form.getValues())
     
    async function onSubmit(values: z.infer<typeof addUserSchema>) {  
      
      const app = document.getElementById('submit');
      const text = 'processing';
      if(app !== null){
        app.innerHTML = text;
      }
      console.log(typeof(values.encrPass))

      if(values.encrPass !== "" && values.encrPass === values.confirmPassword){
        // encrypt password
        const encr = handleEncryption(values.encrPass)
        values.password = (await encr).encryptedData
        values.decInit = (await encr).initVector
      }
      values.image?values.profilePicture = values.image.name:null
        //create obj

        const formData = new FormData()
        formData.append("file", values.image)

        const data = await addUsers(values, formData)
        if(data?.error){
          form.setError("root", {
            "message": "user not added"
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background sm:p-12 p-6">
      <div className="text-2xl font-bold tracking-tight">Add New Dashboard User</div>
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
                  name="userType"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>User Type</FormLabel>
                      <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger id="userType">
                              <SelectValue placeholder="User"/>
                              </SelectTrigger>
                              <SelectContent position="popper" className=" font-[family-name:var(--font-futura)]">
                              <SelectItem value="user">Normal User</SelectItem>
                              <SelectItem value="admin">Admin User</SelectItem>
                              </SelectContent>
                          </Select>
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
                  name="encrPass"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                          <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div><div className="flex flex-col mt-6 space-y-1.5">
              <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                          <Input type="password" placeholder="Confirm Password" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
              <div className="flex flex-col hidden space-y-1.5 mt-6">
              <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl
                      >
                          <Input type="file" {...fieldProps} onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }/>
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
          <div className="bg-light p-2 text-center rounded-md"> User added successfully </div>
        )}
      </form>
      </Form>
        </div>
  )
}
