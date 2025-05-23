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
  phone: text('phone').unique(),
  profilePicture: varchar('profile_picture'),
  userType: text('type').notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  decInit: varchar('decInitVector').notNull(),
  isLoggedIn: boolean("is_logged_in").notNull().default(false),
  lastLogin: timestamp('last_login'),
  loginLocation: text('login_location').default(''),
  createdAt,
  updatedAt,
});

export const userRelations = relations(usersTable, ({many}) => ({
  activity: many(activityTable),
  prescriptions: many(prescriptionsTable),
  receipts: many(receiptTable),
  invoices: many(invoiceTable),
}))


export const currencyTable = pgTable('currency', {
  id: serial('id').primaryKey(),
  code: text('currency_code').notNull(),
  currency: text('currency_name').notNull(),
  country: text('country_name').notNull(),
  country_code: text('country_code').notNull(),
  createdAt,
  updatedAt,
});

export const invoiceTable = pgTable('invoice', {
  id: serial('id').primaryKey(),
  user: integer("user").notNull().references(() => usersTable.id, {onDelete: 'cascade'}),
  address: text("address").notNull(),
  invoiceStatus: text("status").notNull(),
  paymentMeans: text("payment_means"),
  paymentID: text("payment_means_id"),
  createdAt,
  updatedAt
});

export const invoiceRelations = relations(invoiceTable, ({one, many}) => ({
  user: one(usersTable, {fields: [invoiceTable.user], references: [usersTable.id]}),
  invoiceItems: many(invoiceItemsTable),
}))

export const invoiceItemsTable = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoice: integer("invoice_id").notNull().references(() => invoiceTable.id, {onDelete: 'cascade'}),
  product: integer("product_id").notNull().references(() => stockTable.id, {onDelete: 'cascade'}),
  quantity: integer('quantity').notNull().default(1),
  total: integer('total_amount').notNull().default(0),
  createdAt,
  updatedAt
});

export const invoiceItemsRelations = relations(invoiceItemsTable, ({one}) => ({
  invoice: one(invoiceTable, {fields: [invoiceItemsTable.invoice], references: [invoiceTable.id]}),
  product: one(stockTable, {fields: [invoiceItemsTable.product], references: [stockTable.id]}),
}))

export const receipt = pgTable('receipt', {
  id: serial('id').primaryKey(),
  user: integer("user").notNull().references(() => usersTable.id, {onDelete: 'cascade'}),
  createdAt,
  updatedAt
})

export const receiptTable = pgTable('receipt_details', {
  id: serial('id').primaryKey(),
  receipt: integer('receipt_id').notNull().references(() => receipt.id, {onDelete: 'cascade'}),
  product: integer("product_id").notNull().references(() => stockTable.id, {onDelete: 'cascade'}),
  quantity: integer('quantity').notNull().default(1),
  createdAt,
  updatedAt
});

export const receiptRelations = relations(receipt, ({one, many}) => ({
  receipts: many(receiptTable),
  user: one(usersTable, {fields: [receipt.user], references: [usersTable.id]}),
}))

export const receiptItemsRelations = relations(receiptTable, ({one}) => ({
  receipt: one(receipt, {fields: [receiptTable.receipt], references: [receipt.id]}),
  product: one(stockTable, {fields: [receiptTable.product], references: [stockTable.id]}),
}))

export const stockTable = pgTable('stock', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  description: text('description'),
  stockStatus: text("status").default("active"),
  supplier: integer('supplier')
    .references(() => supplierTable.id, { onDelete: 'cascade' }),
  vendor: integer('vendor')
    .references(() => vendorTable.id, { onDelete: 'cascade' }),
  orderDate: timestamp('start_date').notNull(),
  expiryDate: timestamp('end_date').notNull(),
  currency: integer("currency_id").notNull().references(() => currencyTable.id, {onDelete: 'cascade'}),
  unitAmount: integer('amount').notNull(),
  unitsPurchased: integer('units').notNull(),
  paymentMeans: text('payment'),
  packaging: integer("packaging_id").references(() => packagingTable.id, {onDelete: 'cascade'}),
  totalPurchaseAmount: integer('total_cost').notNull(),
  createdAt,
  updatedAt,
});


export const supplierTable = pgTable('supplier', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  phone: text('phone').unique(),
  profilePicture: varchar('profile_picture'),
  physicalAddress: text('address'),
  isActive: boolean("is_active").notNull().default(true),
  token: text('reg_number/license').notNull().unique(),
  createdAt,
  updatedAt,
});

export const stockRelations = relations(stockTable, ({one}) => ({
  supplier: one(supplierTable, {fields: [stockTable.supplier], references: [supplierTable.id]}),
  vendor: one(vendorTable, {fields: [stockTable.vendor], references: [vendorTable.id]}),
  currency: one(currencyTable, {fields: [stockTable.currency], references: [currencyTable.id]}),
  packaging: one(packagingTable, {fields: [stockTable.packaging], references: [packagingTable.id]})
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

export const billsRelations = relations(Bills, ({one}) => ({
  currency: one(currencyTable, {fields: [Bills.currency], references: [currencyTable.id]}),
}))

export const vendorTable = pgTable('vendor', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  phone: text('phone').unique(),
  profilePicture: varchar('profile_picture'),
  physicalAddress: text('address'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt,
  updatedAt,
});

export const packagingTable = pgTable('packaging', {
  id: serial('id').primaryKey(),
  manufacturer: varchar('manufacturer').notNull(),
  manufacturerId: varchar('manufacturer_id').notNull(),
  material: varchar('name').notNull(),
  designFeatures: varchar('seal_label').unique(),
  regulatoryCompliance: varchar('regulation').unique(),
  envConsiderations: varchar('recycle'),
  productCompatibility: varchar('leaching_absorption'),
  barrierProperties: varchar("barriers"),
  unit: varchar("packaging_unit"),
  createdAt,
  updatedAt,
});

export const activityTable = pgTable('activity', {
  id: serial('id').primaryKey(),
  user: integer("user").notNull().references(() => usersTable.id, {onDelete: 'cascade'}),
  activity: text('value').notNull(),
    createdAt,
    updatedAt,
});

export const notificationsTable = pgTable('notifications', {
  id: serial('id').primaryKey(),
  from: integer("user").notNull().references(() => usersTable.id, {onDelete: 'cascade'}),
  status: text('status').notNull(),
  notification: text('notification').notNull(),
    createdAt,
    updatedAt,
});

export const notificationUsersTable = pgTable('notification_users', {
  id: serial('id').primaryKey(),
  notification: integer('notification_id').notNull().references(() => notificationsTable.id, { onDelete: 'cascade' }),
  user: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
});

export const activityRelations = relations(activityTable, ({ one }) => ({
	users: one(usersTable, { fields: [activityTable.user], references: [usersTable.id] }),
}));

export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
	users: one(usersTable, { fields: [notificationsTable.from], references: [usersTable.id] }),
}));

export const notificationsUserRelations = relations(notificationUsersTable, ({ one }) => ({
	notification: one(notificationsTable, { fields: [notificationUsersTable.notification], references: [notificationsTable.id] }),
	user: one(usersTable, { fields: [notificationUsersTable.user], references: [usersTable.id] }),
}));

export const prescriptionsTable = pgTable('prescriptions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age'),
  phone: text('phone'),
  sex: text('male_female'),
  physicalAddress: text('address'),
  testsDone: text('tests_done'),
  diagnosis: text('diagnosis'),
  prescription: text('prescription'),
  userId: integer("user").notNull().references(() => usersTable.id, {onDelete: 'cascade'}),
  createdAt,
  updatedAt,
});

export const prescriptionRelations = relations(prescriptionsTable, ({one}) => ({
	users: one(usersTable, { fields: [prescriptionsTable.userId], references: [usersTable.id] }),
}))

export const reportTable = pgTable('report_settings', {
  id: serial('id').primaryKey(),
  user: text('name').notNull(),
  monthDate: text('date of the month'),
  createdAt,
  updatedAt,
});

export const monthlyReport = pgTable('reports', {
  id: serial('id').primaryKey(),
  monthDate: text('date of the month'),
  month: text('month'),
  createdAt,
  updatedAt,
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertReportSetting = typeof reportTable.$inferInsert;
export type SelectReportSetting = typeof reportTable.$inferSelect;

export type InsertMonthlyReport = typeof monthlyReport.$inferInsert;
export type SelectMonthlyReport = typeof monthlyReport.$inferSelect;

export type InsertPrescription = typeof prescriptionsTable.$inferInsert;
export type SelectPrescription = typeof prescriptionsTable.$inferSelect;

export type InsertInvoiceItem = typeof invoiceItemsTable.$inferInsert;
export type SelectInvoiceItem = typeof invoiceItemsTable.$inferSelect;

export type InsertStock = typeof stockTable.$inferInsert;
export type SelectStock = typeof stockTable.$inferSelect;

export type InsertSupplier = typeof supplierTable.$inferInsert;
export type SelectSupplier = typeof supplierTable.$inferSelect;

export type InsertBills = typeof Bills.$inferInsert;
export type SelectBills = typeof Bills.$inferSelect;

export type InsertVendor = typeof vendorTable.$inferInsert;
export type SelectVendor = typeof vendorTable.$inferSelect;

export type InsertActvity = typeof activityTable.$inferInsert;
export type SelectActivity = typeof activityTable.$inferSelect;

export type InsertPackaging = typeof packagingTable.$inferInsert;
export type SelectPackaging = typeof packagingTable.$inferSelect;

export type InsertNotification = typeof notificationsTable.$inferInsert;
export type SelectNotification = typeof notificationsTable.$inferSelect;

export type InsertNotificationsUser = typeof notificationUsersTable.$inferInsert;
export type SelectNotificationsUser = typeof notificationUsersTable.$inferSelect;