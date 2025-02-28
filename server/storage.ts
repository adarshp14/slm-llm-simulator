import { users, type User, type InsertUser } from "@shared/schema";
import { modelComparisons, type ModelComparison, type InsertModelComparison } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createModelComparison(comparison: InsertModelComparison): Promise<ModelComparison>;
  getRecentComparisons(): Promise<ModelComparison[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private comparisons: ModelComparison[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.comparisons = [];
    this.currentId = 1;
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
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createModelComparison(comparison: InsertModelComparison): Promise<ModelComparison> {
    const newComparison: ModelComparison = {
      id: this.comparisons.length + 1,
      ...comparison,
      createdAt: new Date()
    };
    this.comparisons.push(newComparison);
    return newComparison;
  }

  async getRecentComparisons(): Promise<ModelComparison[]> {
    return this.comparisons.slice(-5).reverse();
  }
}

export const storage = new MemStorage();