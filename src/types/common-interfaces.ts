import { Document, ObjectId } from "mongoose";

export default interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  toPay: ObjectId[]; // people the user owes money
  toReceive: ObjectId[]; // people who owes the user money
}

export interface DebtCard extends Document {
  payer: string;
  receiver: string;
  reason: string;
  amount: number;
  paid: boolean;
  createdAt?: string;
  updatedAt?: string;
}
