import { Schema } from "mongoose";

const UserModel = new Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    toPay: [],
    toReceive: [],
  },
  { timestamps: true }
);

export default UserModel;
