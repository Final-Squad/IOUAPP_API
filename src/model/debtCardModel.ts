import { Schema } from "mongoose";

const DebtCardModel = new Schema(
  {
    payer: { type: String, unique: false },
    receiver: { type: String, unique: false },
    reason: String,
    amount: String,
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default DebtCardModel;
