"use server"

import { db } from "@/drizzle/db";
import { Bills, activityTable, currencyTable, packagingTable, stockTable, supplierTable, usersTable, vendorTable} from "@/drizzle/schema";
// import "use-server"
import { z } from "zod";
import { loginUserSchema, addUserSchema, addSupplier, addVendor, addStock, addBill, addPackaging } from '@/schema/formSchemas'
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { File } from "node:buffer";
import { promises as fs } from "node:fs";
import { sendEmail } from "../nodemailer";

const today = new Date()

export async function addUsers(unsafeData: z.infer<typeof addUserSchema>, formData: FormData) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addUserSchema.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   uploadFile(formData)

   await db.insert(usersTable).values({...data})
   //log what we did
   await logActivity("Added new user: "+data.email, data.userId)

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

export async function sendHtmlEmail(email: string, title:string, name:string){
    sendEmail(email, title, name)
    return true
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
   let id = 0

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
    id = checkEmail.id

    // before login, update isloggedin and lastlogin
    await db.update(usersTable).set({
        isLoggedIn: true,
        lastLogin: today
    }).where(
        eq(usersTable.email, data.email)
    )
   }
   
   return [token, encrPass, initVector, usertype, email, username, name, id.toString()]
}

export async function addSuppliers(unsafeData: z.infer<typeof addSupplier>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addSupplier.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   await db.insert(supplierTable).values({...data})

   await logActivity("Added new Supplier: "+data.name, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function addvendors(unsafeData: z.infer<typeof addVendor>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addVendor.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   await db.insert(vendorTable).values({...data})
   await logActivity("Added new Vendor: "+data.name, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function addNewStock(unsafeData: z.infer<typeof addStock>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addStock.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }
   // add currencies
   const currencyId = await db.query.currencyTable.findMany({
    where: eq(currencyTable.currency, data.currency1)
   })
   // add supplier
   if(data.supplier1 !== ""){
    const supplierId = await db.query.supplierTable.findMany({
        where: eq(supplierTable.name, data.supplier1)
    })
    const supplierid = supplierId.map(supplier=>supplier.id)
    data.supplier = supplierid[0]
    data.vendor = null
}
   // add packaging
   const packagingId = await db.query.packagingTable.findMany({
    where: eq(packagingTable.manufacturer, data.packaging1)
   })
   // add vendor
   if(data.vendor1 !== ""){
    const vendorId = await db.query.vendorTable.findMany({
        where: eq(vendorTable.name, data.vendor1)
    })
    const vendorid = vendorId.map(vendor=>vendor.id)
    data.vendor = vendorid[0]
    data.supplier = null
}
   const currencyid = currencyId.map(currency=>currency.id)
   const packagingid = packagingId.map(packaging=>packaging.id)
   data.currency = currencyid[0]
   data.packaging = packagingid[0]

   await db.insert(stockTable).values({...data})

   await logActivity("Added new Stock: "+data.name, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function addNewBill(unsafeData: z.infer<typeof addBill>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addBill.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }
   // add currencies
   const currencyId = await db.query.currencyTable.findMany({
    where: eq(currencyTable.currency, data.currency1)
   })
   const currencyid = currencyId.map(currency=>currency.id)
   data.currency = currencyid[0]

   await db.insert(Bills).values({...data})

   await logActivity("Added new Bill: "+data.name, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function addNewPackaging(unsafeData: z.infer<typeof addPackaging>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addPackaging.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   await db.insert(packagingTable).values({...data})

   await logActivity("Added new Packaging: "+data.manufacturer, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function logActivity(activity: string, userId: string): Promise<{error: boolean, message: string}>{
    //create our data object
    const data = {
        user: parseInt(userId),
        activity: activity
    }
    if(!activity && !userId){
        return {error: true, message: "missing information"}
    } else{
        // with all the information on what we are doing
        //lets log who did what
        await db.insert(activityTable).values({...data})
        return {error: false, message: "ok"}
    }
}