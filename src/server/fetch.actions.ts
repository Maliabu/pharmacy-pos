"use server"

import { db } from "@/drizzle/db";
import { Bills, activityTable, currencyTable, invoiceItemsTable, invoiceTable, packagingTable, stockTable, supplierTable, usersTable, vendorTable} from "@/drizzle/schema";
// import "use-server"
import { z } from "zod";
import { loginUserSchema, addUserSchema, addSupplierSchema, addVendorSchema, addStockSchema, addBillSchema, addPackagingSchema, addInvoiceSchema, addInvoiceItemsSchema } from '@/schema/formSchemas'
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { File } from "node:buffer";
import { promises as fs } from "node:fs";
import { sendEmail } from "../nodemailer";
import { desc } from 'drizzle-orm';

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
   let userType = ''

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
    userType = checkEmail.userType

    // before login, update isloggedin and lastlogin
    await db.update(usersTable).set({
        isLoggedIn: true,
        lastLogin: today
    }).where(
        eq(usersTable.email, data.email)
    )
   }
   
   return [token, encrPass, initVector, usertype, email, username, name, id.toString(), userType]
}

export async function addSuppliers(unsafeData: z.infer<typeof addSupplierSchema>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addSupplierSchema.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   await db.insert(supplierTable).values({...data})

   await logActivity("Added new Supplier: "+data.name, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function addvendors(unsafeData: z.infer<typeof addVendorSchema>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addVendorSchema.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   await db.insert(vendorTable).values({...data})
   await logActivity("Added new Vendor: "+data.name, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function addNewStock(unsafeData: z.infer<typeof addStockSchema>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addStockSchema.safeParse(unsafeData)

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

export async function addNewBill(unsafeData: z.infer<typeof addBillSchema>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addBillSchema.safeParse(unsafeData)

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

export async function addNewPackaging(unsafeData: z.infer<typeof addPackagingSchema>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addPackagingSchema.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }

   await db.insert(packagingTable).values({...data})

   await logActivity("Added new Packaging: "+data.manufacturer, data.userId)

   return {error: false}
//    redirect("/admin/dashboard")
}

export async function addNewInvoice(unsafeData: z.infer<typeof addInvoiceSchema>) : 
Promise<{error: boolean | undefined, id: number}> {
   const {success, data} = addInvoiceSchema.safeParse(unsafeData)

   if (!success){
    return {error: true, id: 0}
   }
   console.log("SERVER SIDE")
  
   // upload invoice data
   await db.insert(invoiceTable).values({...data})
   console.log("ADDED INVOICE DATA")
   // get last invoice id by this user
   const result = await db.query.invoiceTable.findMany({
    where: eq(invoiceTable.user, data.user),
    orderBy: [desc(invoiceTable.id)],
    limit: 1,
    })
    let lastId = 0
    if (result.length > 0) {
        lastId = result[0].id; // return the last id
    }
    console.log("GETTING INVOICE ID SERVER SIDE")
    // update items data
   // update today of the invoice
   return {error: false, id: lastId}
//    redirect("/admin/dashboard")
}

export async function addInvoiceItems(unsafeData: z.infer<typeof addInvoiceItemsSchema>) : 
Promise<{error: boolean | undefined}> {
   const {success, data} = addInvoiceItemsSchema.safeParse(unsafeData)

   if (!success){
    return {error: true}
   }
   // upload invoice data
   // get last invoice id by this user
   // update items data
   // update today of the invoice

   await db.insert(invoiceItemsTable).values({...data})

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