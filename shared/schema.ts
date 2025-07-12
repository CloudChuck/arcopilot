import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const patientAccounts = pgTable("patient_accounts", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  accountNumber: text("account_number").notNull(),
  insuranceName: text("insurance_name").notNull(),
  repName: text("rep_name"),
  callReference: text("call_reference"),
  denialCode: text("denial_code"),
  denialDescription: text("denial_description"),
  dateOfService: text("date_of_service"),
  eligibilityFromDate: text("eligibility_from_date"),
  eligibilityStatus: text("eligibility_status"),
  additionalNotes: text("additional_notes"),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertPatientAccountSchema = createInsertSchema(patientAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePatientAccountSchema = insertPatientAccountSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPatientAccount = z.infer<typeof insertPatientAccountSchema>;
export type UpdatePatientAccount = z.infer<typeof updatePatientAccountSchema>;
export type PatientAccount = typeof patientAccounts.$inferSelect;
