import { patientAccounts, users, type User, type InsertUser, type PatientAccount, type InsertPatientAccount, type UpdatePatientAccount } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient account methods
  getPatientAccountsBySession(sessionId: string): Promise<PatientAccount[]>;
  getPatientAccount(id: number): Promise<PatientAccount | undefined>;
  createPatientAccount(account: InsertPatientAccount): Promise<PatientAccount>;
  updatePatientAccount(id: number, updates: UpdatePatientAccount): Promise<PatientAccount | undefined>;
  deletePatientAccount(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patientAccounts: Map<number, PatientAccount>;
  private currentUserId: number;
  private currentAccountId: number;

  constructor() {
    this.users = new Map();
    this.patientAccounts = new Map();
    this.currentUserId = 1;
    this.currentAccountId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPatientAccountsBySession(sessionId: string): Promise<PatientAccount[]> {
    return Array.from(this.patientAccounts.values()).filter(
      (account) => account.sessionId === sessionId
    );
  }

  async getPatientAccount(id: number): Promise<PatientAccount | undefined> {
    return this.patientAccounts.get(id);
  }

  async createPatientAccount(insertAccount: InsertPatientAccount): Promise<PatientAccount> {
    const id = this.currentAccountId++;
    const now = new Date();
    const account: PatientAccount = { 
      ...insertAccount, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.patientAccounts.set(id, account);
    return account;
  }

  async updatePatientAccount(id: number, updates: UpdatePatientAccount): Promise<PatientAccount | undefined> {
    const existing = this.patientAccounts.get(id);
    if (!existing) return undefined;

    const updated: PatientAccount = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.patientAccounts.set(id, updated);
    return updated;
  }

  async deletePatientAccount(id: number): Promise<boolean> {
    return this.patientAccounts.delete(id);
  }
}

export const storage = new MemStorage();
