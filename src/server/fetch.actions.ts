"use server"

import { db } from "@/drizzle/db";
import { usersTable} from "@/drizzle/schema";
// import "use-server"
import { z } from "zod";
import { loginUserSchema, addUserSchema } from '@/schema/formSchemas'
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { File } from "node:buffer";
import { promises as fs } from "node:fs";
import { sendEmail } from "../nodemailer";

export async function addUsers(unsafeData: z.infer<typeof addUserSchema>, formData: FormData) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addUserSchema.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   uploadFile(formData)

   await db.insert(usersTable).values({...data})

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as unknown as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    try {
        await fs.writeFile(`./public/profilePictures/${file.name}`, buffer);
    }
    catch{
        await fs.mkdir('./public/profilePictures')
        await fs.writeFile(`./public/profilePictures/${file.name}`, buffer);
    }
    revalidatePath("/");
}

export async function uploadEventFile(formData: FormData) {
    const file = formData.get("file") as unknown as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    try {
        await fs.writeFile(`./public/events/${file.name}`, buffer);
    }
    catch{
        await fs.mkdir('./public/events')
        await fs.writeFile(`./public/events/${file.name}`, buffer);
    }
    revalidatePath("/");
}

export async function sendHtmlEmail(email: string, title:string, name:string){
    sendEmail(email, title, name)
    return true
}

export async function uploadCourseFile(formData: FormData) {
    const file = formData.get("file") as unknown as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    try {
        await fs.writeFile(`./public/courses/${file.name}`, buffer);
    }
    catch{
        await fs.mkdir('./public/courses')
        await fs.writeFile(`./public/courses/${file.name}`, buffer);
    }
    revalidatePath("/");
}

export async function uploadArticleFile(formData: FormData) {
    const file = formData.get("file") as unknown as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    try {
        await fs.writeFile(`./public/articles/${file.name}`, buffer);
    }
    catch{
        await fs.mkdir('./public/articles')
        await fs.writeFile(`./public/articles/${file.name}`, buffer);
    }
    revalidatePath("/");
}

export async function loginUser(unsafeData: z.infer<typeof loginUserSchema>){
   const {success, data} = loginUserSchema.safeParse(unsafeData)

   if (!success){
    return ["error"]
   }

   //goal is to get token
   let token = ''
   let encrPass = ''
   let initVector = ''
   let usertype = ''
   let email = ''
   let username = ''
   let name = ''

   const checkEmail = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, data.email)
   })
   if(checkEmail && checkEmail.isActive === true){
    encrPass = checkEmail.password
    initVector = checkEmail.decInit
    token = checkEmail.token
    usertype = checkEmail.userType
    email = checkEmail.email
    username = checkEmail.username
    name = checkEmail.name
   }
   return [token, encrPass, initVector, usertype, email, username, name]
}
