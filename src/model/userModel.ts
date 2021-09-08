import { Schema } from "mongoose";

const UserModel = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    toPay: [],
    toReceive: [],
  },
  { timestamps: true }
);

export default UserModel;
