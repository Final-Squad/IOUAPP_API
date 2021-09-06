import mongoose, { Model, ObjectId } from "mongoose";
import { DebtCard } from "../types/common-interfaces";

import DB from "./db";

export default class DebtCardDAO {
  errMessage: string = 'debtCardDAO -> ';
  db: DB;
  debtCardDB: Model<DebtCard>;

  constructor(db: DB = new DB()) {
    this.db = db;
    this.debtCardDB = db.debtCard;
  }

  async allDebtCards(): Promise<DebtCard[] | null> {
    const debtCards: DebtCard[] | null = await this.debtCardDB
      .find()
      .then((docs) => {
        return docs;
      })
      .catch((err) => {
        this.db.DAOError(err, this.errMessage + 'allDebtCards');
        return null;
      })
    return debtCards;
  }

  async getDebtCardById(id: mongoose.Types.ObjectId): Promise<DebtCard | null> {
    const debtCard = this.debtCardDB.findById(id);
    if (debtCard) {
      return debtCard;
    } else {
      this.db.DAOError("DebtCard with id doesn't exist", this.errMessage + 'getDebtCardById');
      return null;
    }
  }

  async getDebtCardsForPayer(email: string): Promise<DebtCard[] | null> {
    const payerDebtCards: DebtCard[] | null = await this.debtCardDB
      .find({ payer: email })
      .then((docs) => {
        return docs;
      })
      .catch((err) => {
        this.db.DAOError(err, this.errMessage + 'getDebtCardsForPayer');
        return null;
      });
    return payerDebtCards;
  }

  async getDebtCardsForReceiver(email: string): Promise<DebtCard[] | null> {
    const receiverDebtCards: DebtCard[] | null = await this.debtCardDB
      .find({ receiver: email })
      .then((docs) => docs)
      .catch((err) => {
        this.db.DAOError(err, this.errMessage + 'getDebtCardsForReceiver');
        return null;
      });
    return receiverDebtCards;
  }

  createDebtCard(reqDebtCardDB: any): Promise<DebtCard | null> {
    const newDebtCardDB = this.debtCardDB.create(reqDebtCardDB)
      .then((card) => card)
      .catch((err) => {
        this.db.DAOError(err, this.errMessage + 'createDebtCard');
        return null;
      });
    return newDebtCardDB;
  }

  async deleteDebtCard(id: ObjectId): Promise<boolean> {
    const debtCard = this.debtCardDB.findById(id);
    if (debtCard) {
      debtCard.remove();
      return true;
    } else {
      this.db.DAOError("user with email doesn't exist", this.errMessage + 'deleteUser');
      return false;
    }
  }

}
