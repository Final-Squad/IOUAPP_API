import { Request, Response } from "express";
import User, { DebtCard } from "../types/common-interfaces";
import DebtCardDAO from "../dao/debtCardDAO";
import UserDAO from "../dao/userDAO";
import mongoose, { deleteModel } from "mongoose";
import { debtCardList, jsonifyDebtCard, validateRequest } from "./utils";
const logger = require("../../logger/logger");

export default class DebtCardService {
  debtCardDAO: DebtCardDAO;
  userDAO: UserDAO;

  constructor(debtCardDAO: DebtCardDAO = new DebtCardDAO(), userDAO: UserDAO = new UserDAO()) {
    this.debtCardDAO = debtCardDAO;
    this.userDAO = userDAO;
  }

  async getAllDebtCards(req: Request, res: Response): Promise<Response> {
    const debtCards: DebtCard[] | null = await this.debtCardDAO.allDebtCards();
    if (debtCards) {
      const _debtCards: any[] = [];
      debtCards.forEach((card) => _debtCards.push(jsonifyDebtCard(card)));
      return res.status(200).json({ length: _debtCards.length, debtCards: _debtCards });
    } else {
      return res
        .status(400)
        .json({ error: "UNABLE to get all debtCards (debt cards) from the database" });
    }
  }

  async getDebtCardById(req: Request, res: Response): Promise<Response> {
    validateRequest(req, res);

    const id = new mongoose.Types.ObjectId(req.params.debtcard_id);
    const debtCard: DebtCard | null = await this.debtCardDAO.getDebtCardById(id);

    if (debtCard) {
      return res.status(201).json({ debtCard: jsonifyDebtCard(debtCard) });
    } else {
      return res.status(400).json({ error: "incorrect debtCard id" });
    }
  }

  async getDebtCardsPaidToOrByUser(req: Request, res: Response): Promise<Response> {
    validateRequest(req, res);

    const email: string = req.params.user_email;

    const payer: DebtCard[] | null = await this.debtCardDAO.getDebtCardsForPayer(email);
    const receiver: DebtCard[] | null = await this.debtCardDAO.getDebtCardsForReceiver(email);

    if (payer === null || receiver === null) {
      res.status(400).json({ message: "something went wrong!" });
    }

    if (payer) {
      payer.forEach((debtCard, index) => {
        if (debtCard.paid === false) {
          delete payer[index];
        }
      })
    }
    if (receiver) {
      receiver.forEach((debtCard, index) => {
        if (debtCard.paid === false) {
          delete receiver[index];
        }
      })
    }

    return res.status(200).json({ youPaid: debtCardList(payer), youReceived: debtCardList(receiver) })

  }

  async createDebtCard(req: Request, res: Response): Promise<Response> {
    validateRequest(req, res);

    const reqDebtCard = {
      payer: req.body.payer,
      receiver: req.body.receiver,
      reason: req.body.reason,
      amount: req.body.amount,
    }

    const debtCard = await this.debtCardDAO.createDebtCard(reqDebtCard);
    if (debtCard) {
      logger.info({
        message:
          process.env.NODE_ENV === "development"
            ? jsonifyDebtCard(debtCard, false)
            : "created a new debtCard",
        debtCard: jsonifyDebtCard(debtCard),
        service: "service/debtCardService -> createDebtCard",
        environment: process.env.NODE_ENV,
      });
      this.addToPayerAndReceiverBuffer(debtCard);
      return res.status(201).json({ debtCard: jsonifyDebtCard(debtCard) });
    } else {
      return res.status(400).json({ error: "UNABLE to save to database" });
    }
  }

  async getDebtCards(req: Request, res: Response): Promise<Response> {
    validateRequest(req, res);

    let debtCards: DebtCard[] | null = [];
    let debtCardsResponse: DebtCard[] | null = [];

    const userEmail: string = req.params.user_email;
    const debtType = req.query.debt || null;
    if (debtType && debtType === 'payer') {
      debtCards = await this.debtCardDAO.getDebtCardsForPayer(userEmail);
      debtCards?.map((debtCard) => {
        if (debtCard.paid === false) {
          debtCardsResponse?.push(debtCard)
        }
      });
    } else if (debtType && debtType === 'receiver') {
      debtCards = await this.debtCardDAO.getDebtCardsForReceiver(userEmail);
      debtCards?.map((debtCard) => {
        if (debtCard.paid === false) {
          debtCardsResponse?.push(debtCard)
        }
      });
    }
    return res.status(200).json({ debtCards: debtCardList(debtCardsResponse) });
  }

  async updateDebtCardPaymentStatus(req: Request, res: Response): Promise<Response> {
    validateRequest(req, res);

    const id = new mongoose.Types.ObjectId(req.params.debtcard_id);
    const isPaid: boolean = req.query.paid === 'true';
    const debtCard: DebtCard | null = await this.payDebtCardById(id, isPaid);

    if (debtCard) {
      return res.status(201).json({ debtCard: jsonifyDebtCard(debtCard) });
    } else {
      return res.status(400).json({ error: "incorrect debtCard id" });
    }
  }

  async addToPayerAndReceiverBuffer(debtCard: DebtCard): Promise<any>  {
    try {
      const payer: User | null = await this.userDAO.getUserByEmail(debtCard.payer);
      const receiver: User | null = await this.userDAO.getUserByEmail(debtCard.receiver);

      payer?.toPay.push(debtCard._id.toString());
      receiver?.toReceive.push(debtCard._id.toString());
      payer?.save();
      receiver?.save();
    } catch (err: any) {
      logger.error({
        message: err,
        service: "service/debtCardService -> addToPayerOrReceiverBuffer",
        environment: process.env.NODE_ENV,
      });
    }
  }

  async payDebtCardById(id: mongoose.Types.ObjectId, paid: boolean): Promise<DebtCard | null>  {
    const debtCard: DebtCard | null = await this.debtCardDAO.getDebtCardById(id);
    if (debtCard) {
      debtCard.paid = paid;
      debtCard.save();
      return debtCard;
    } else {
      logger.error({
        message: "can not find card",
        service: "service/debtCardService -> payDebtCardById",
        environment: process.env.NODE_ENV,
      });
      return null;
    }
  }

  async deleteDebtcard(req: Request, res: Response): Promise<Response> {
    const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(req.params.debtcard_id);
    const isDeleted: boolean = await this.debtCardDAO.deleteDebtCard(_id);
    return res.status(200).json({ isDeleted });
  }

}
