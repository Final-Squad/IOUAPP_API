import mongoose, { Model, ObjectId, Schema } from "mongoose";
import User, { DebtCard } from "../types/common-interfaces";
import UserModel from "../model/userModel";
import DebtCardModel from "../model/debtCardModel";
const logger = require("../../logger/logger");

export default class DB {
  user: Model<User>;
  debtCard: Model<DebtCard>;

  constructor() {
    this.user = mongoose.model<User>("User", UserModel);
    this.debtCard = mongoose.model<DebtCard>("DebtCard", DebtCardModel);
  }

  public static connect() {
    mongoose
      .connect(
        process.env.NODE_ENV === "development"
          ? process.env.MONGO_URI_DEV || "null"
          : process.env.MONGO_URI_PROD || "null"
      )
      .then(() => {
        logger.info({
          message: "CONNECTED TO DATABASE ✅",
          service: "database",
          environment: process.env.NODE_ENV,
        });
      })
      .catch(() =>
        logger.error({
          message: "CANNOT CONNECT TO DATABASE ❌",
          service: "database",
          environment: process.env.NODE_ENV,
        })
      );
  }

  close() {
    mongoose.connection.close();
    logger.debug(`CONNECTION CLOSED ✌🏽`);
  }

  DAOError(message: any, file: string): any {
    return logger.error({
      message,
      file,
      environment: process.env.NODE_ENV,
    });
  }

}
