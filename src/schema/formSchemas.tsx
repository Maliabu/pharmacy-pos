import { z } from "zod";

export const addUserSchema = z.object({
    name: z.string({required_error: "Please enter your full name.",}).min(2, {
        message: "Please enter both names separated by a space bar"
    }).max(50),
    password: z.string(),
    email: z.string({required_error: "Please enter your email.",}).min(5, {
        message: "email too short"
    }).max(75).regex(/^([a-z]|[0-9])+[\.]*[\@]{1}[a-z]+[\.]{1}[a-z]{2,3}$/, {message: "please enter a correct email"}),
    token: z.string().min(15, {message: "missing token"}),
    username: z.string().min(2, {message: "missing username"}),
    profilePicture: z.string(),
    userType: z.string({required_error: "Please select the type of user.",}),
    phone: z.string({required_error: "Please provide a phone number.",}),
    confirmPassword: z.string({required_error: "Please confirm your password.",}),
    decInit: z.string(),
    encrPass: z.string({required_error: "Please enter a password.",}).min(2, {
        message: "Password must be atleast 8 characters"
    }).max(50),
    userId: z.string(),
    image: z.any()
}).superRefine(({ confirmPassword, encrPass }, ctx) => {
    if (confirmPassword !== encrPass) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });

export const loginUserSchema = z.object({
    email: z.string({required_error: "Please enter your email.",}).min(5, {
        message: "email too short"
    }),
    password: z.string({required_error: "Please enter a password.",}).min(2, {
        message: "Password must be atleast 8 characters"
    }).max(50),
})

export const reportSchema = z.object({
    user: z.string({required_error: "Please provide a user.",}).min(1, {
        message: "user id required"
    }),
    monthDate: z.string({required_error: "Please enter a date.",}).min(1, {
        message: "date is required"
    }).max(50),
})

export const addStockSchema = z.object({
    name: z.string({required_error: "Please enter a name.",}).min(2, {
        message: "title should be atleast a character"
    }).max(50),
    description: z.string({required_error: "Please enter a description.",}),
    stockStatus: z.string(),
    supplier: z.coerce.number({required_error: "Please enter a supplier.",}).nullable(),
    vendor: z.coerce.number({required_error: "Please enter a vendor.",}).nullable(),
    paymentMeans: z.string(),
    orderDate: z.date({required_error: "Please enter a date.",}),
    expiryDate: z.date({required_error: "Please enter a date.",}),
    currency: z.coerce.number({required_error: "Please enter a currency.",}),
    currency1: z.string(),
    supplier1: z.string(),
    vendor1: z.string(),
    unitAmount: z.coerce.number({required_error: "Please enter a unit cost.",}),
    unitsPurchased: z.coerce.number({required_error: "Please enter a number.",}),
    packaging: z.coerce.number({required_error: "Please enter a unit of purchase.",}),
    packaging1: z.string(),
    userId: z.string(),
})

//remember to coerce numbers else form doesnot submit
export const addSupplierSchema = z.object({
    name: z.string({required_error: "Please enter a name.",}).min(2, {
        message: "title should be atleast a character"
    }).max(50),
    email: z.string({required_error: "Please enter your email.",}).min(5, {
        message: "email too short"
    }),
    phone: z.string({required_error: "Please enter a phone.",}),
    physicalAddress: z.string(),
    token: z.string(),
    userId: z.string(),
})

export const addVendorSchema = z.object({
    name: z.string({required_error: "Please enter a name.",}).min(2, {
        message: "title should be atleast a character"
    }).max(50),
    email: z.string({required_error: "Please enter your email.",}).min(5, {
        message: "email too short"
    }),
    phone: z.string({required_error: "Please provide a phone number.",}),
    physicalAddress: z.string(),
    userId: z.string(),
})

export const addInvoiceSchema = z.object({
    invoiceStatus: z.string(),
    address: z.string({required_error: "Please enter an address.",}).min(5, {
        message: "provide an accurate address"
    }),
    paymentMeans: z.string(),
    paymentID: z.string(),
    user: z.coerce.number({required_error: "Please provide a user.",}),
})

export const addInvoiceItemsSchema = z.object({
    product: z.coerce.number({required_error: "Please provide a product.",}),
    invoice: z.coerce.number({required_error: "Please enter an invoice",}),
    quantity: z.coerce.number({required_error: "Please enter a quantity",}),
    total: z.coerce.number()
})

export const addReceipt = z.object({
    product: z.string(),
    quantity: z.coerce.number({required_error: "Please enter a quantity",}),
    receipt: z.coerce.number({required_error: "Please enter a receipt number",}),
})

export const addBillSchema = z.object({
    name: z.string({required_error: "Please enter your purchase.",}).min(2, {
        message: "name should be atleast a character"
    }).max(50),
    description: z.string({required_error: "Please enter a description.",}),
    status: z.string(),
    currency: z.coerce.number({required_error: "Please enter a currency.",}),
    amount: z.coerce.number({required_error: "Please enter an amount.",}),
    currency1: z.any(),
    userId: z.string(),
})

export const addPackagingSchema = z.object({  
    manufacturer: z.string({required_error: "Please enter name of manufacturer.",}).min(2, {
    message: "name should be atleast a character"
    }).max(50) ,
    manufacturerId: z.string({required_error: "Please enter an id.",}).min(2, {
        message: "manufacturer should have a unique identifier"
    }).max(50),
    designFeatures: z.string(),
    material: z.string(),
    regulatoryCompliance: z.string(),
    envConsiderations: z.string(),
    productCompatibility: z.string(),
    barrierProperties: z.string(),  
    unit: z.string({required_error: "Please enter a unit of purchase.",}).min(2, {
        message: "unit is required"
    }).max(50),
    userId: z.string(),
})

export const addPrescription = z.object({  
    name: z.string({required_error: "Please enter name of patient.",}).min(2, {
    message: "name should be atleast a character"
    }).max(50) ,
    sex: z.string({required_error: "Please enter a sex.",}).min(1, {
        message: "male or female patient?"
    }).max(50),
    age: z.string({required_error: "Please enter a the age.",}).min(2, {
        message: "age is required"
    }).max(50),
    physicalAddress: z.string({required_error: "Please enter an address.",}).min(2, {
        message: "provide patient address"
    }).max(200),
    phone: z.string({required_error: "Please enter a contact.",}).min(2, {
        message: "enter a phone number"
    }).max(50),
    testsDone: z.string({required_error: "Please provide tests done.",}).min(2, {
        message: "what tests were run"
    }).max(200),
    diagnosis: z.string({required_error: "Please enter a diagnosis.",}).min(2, {
        message: "tests done need a diagnosis"
    }).max(200),
    prescription: z.string({required_error: "Please enter a prescription.",}).min(2, {
        message: "you need a prescription for your diagnosis"
    }).max(200),
    userId: z.string(),
})

export const deleteSchema = z.object({
    courseId: z.coerce.number({required_error: "Please provide a course to delete.",}),
})
export const deleteEventSchema = z.object({
    eventId: z.coerce.number({required_error: "Please provide an event to delete.",}),
})
export const deleteUserSchema = z.object({
    userId: z.coerce.number({required_error: "Please provide a user to delete.",}),
})
export const deleteArticleSchema = z.object({
    articleId: z.coerce.number({required_error: "Please provide an article to delete.",}),
})
