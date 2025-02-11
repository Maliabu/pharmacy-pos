import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

const createdAt = timestamp('created_at').notNull().defaultNow()
const updatedAt = timestamp('updated_at')
  .$onUpdate(() => new Date())

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  password: varchar('password').notNull(),
  email: text('email').notNull().unique(),
  token: text('token').notNull().unique(),
  username: varchar('username').notNull().unique(),
  profilePicture: varchar('profile_picture'),
  userType: text('type').notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  decInit: varchar('decInitVector').notNull(),
  isLoggedIn: boolean("is_logged_in").notNull().default(false),
  lastLogin: timestamp('last_login'),
  createdAt,
  updatedAt,
});

export const currencyTable = pgTable('currency_table', {
  id: serial('id').primaryKey(),
  code: text('currency_code').notNull(),
  currency: text('currency_name').notNull(),
  country: text('name').notNull(),
  country_code: text('country_code').notNull(),
  createdAt,
  updatedAt,
});

export const invoiceTable = pgTable('currency_table', {
  id: serial('id').primaryKey(),
  product: integer("product_id").notNull().references(() => stockTable.id, {onDelete: 'cascade'}),
  user: integer("currency_id").notNull().references(() => usersTable.id, {onDelete: 'cascade'}),
  invoiceStatus: text("status").notNull(),
  invoiceGroup: text("invoice_products_id").notNull(),
  createdAt,
});

export const stockTable = pgTable('stock', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  description: text('description').notNull(),
  stockStatus: text("status").notNull(),
  supplier: integer('supplier')
    .references(() => supplierTable.id, { onDelete: 'cascade' }),
  vendor: integer('vendor')
    .references(() => vendorTable.id, { onDelete: 'cascade' }),
  orderDate: timestamp('start_date').notNull(),
  expDate: timestamp('end_date').notNull(),
  currency: integer("currency_id").notNull().references(() => currencyTable.id, {onDelete: 'cascade'}),
  unitAmount: integer('amount').notNull(),
  unitsPurchased: integer('units').notNull(),
  unit: integer('unit').notNull().references(() => unitsTable.id, {onDelete: 'cascade'}),
  createdAt,
  updatedAt,
});


export const supplierTable = pgTable('supplier', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  phone: integer('phone').unique(),
  profilePicture: varchar('profile_picture'),
  physicalAddress: text('address'),
  isActive: boolean("is_active").notNull().default(true),
  token: text('token').notNull().unique(),
  decInit: varchar('decInitVector').notNull(),
  createdAt,
  updatedAt,
});

export const stockRelations = relations(stockTable, ({many, one}) => ({
  supplier: many(supplierTable),
  vendor: many(vendorTable),
  currency: many(supplierTable),
  unit: one(supplierTable, {fields: [stockTable.supplier], references: [supplierTable.id]}),
}))

export const Bills = pgTable('bills', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  description: text('description').notNull(),
  status: varchar('link'),
  currency: integer("currency_id").notNull().references(() => currencyTable.id, {onDelete: 'cascade'}),
  amount: integer('amount').notNull(),
  createdAt,
  updatedAt,
});

export const billsRelations = relations(Bills, ({many}) => ({
  currency: many(supplierTable),
}))

export const vendorTable = pgTable('vendor', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  phone: integer('phone').unique(),
  profilePicture: varchar('profile_picture'),
  physicalAddress: text('address'),
  isActive: boolean("is_active").notNull().default(true),
  token: text('token').notNull().unique(),
  decInit: varchar('decInitVector').notNull(),
  createdAt,
  updatedAt,
});

export const packagingTable = pgTable('vendor', {
  id: serial('id').primaryKey(),
  product: integer("stock_id").notNull().references(() => stockTable.id, {onDelete: 'cascade'}),
  manufacturer: varchar('manufacturer').notNull(),
  manufacturerId: varchar('manufacturer_id').notNull(),
  material: varchar('name').notNull(),
  designFeatures: varchar('seal_label').unique(),
  regulatoryCompliance: varchar('regulation').unique(),
  envConsiderations: varchar('recycle'),
  productCompatibility: varchar('leaching_absorption'),
  barrierProperties: varchar("barriers"),
  createdAt,
  updatedAt,
});

export const packagingRelations = relations(packagingTable, ({one}) => ({
  stock: one(stockTable, {fields: [packagingTable.product], references: [stockTable.id]}),
}))

export const unitsTable = pgTable('units', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  value: text('value').notNull().unique(),
    createdAt,
    updatedAt,
});


export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertStock = typeof stockTable.$inferInsert;
export type SelectStock = typeof stockTable.$inferSelect;

export type InsertSupplier = typeof supplierTable.$inferInsert;
export type SelectSupplier = typeof supplierTable.$inferSelect;

export type InsertBills = typeof Bills.$inferInsert;
export type SelectBills = typeof Bills.$inferSelect;

export type InsertVendor = typeof vendorTable.$inferInsert;
export type SelectVendor = typeof vendorTable.$inferSelect;

export type InsertUnits = typeof unitsTable.$inferInsert;
export type SelectUnits = typeof unitsTable.$inferSelect;

export type InsertPackaging = typeof packagingTable.$inferInsert;
export type SelectPackaging = typeof packagingTable.$inferSelect;