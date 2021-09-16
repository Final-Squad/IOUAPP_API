import { validationResult } from "express-validator";
import { Request, Response } from "express";
import User, { DebtCard } from "../types/common-interfaces";

export const jsonifyDebtCard = (debtCard: DebtCard, json: boolean = true) => {
  const data = {
    id: String(debtCard._id),
    payer: debtCard.payer,
    receiver: debtCard.receiver,
    reason: debtCard.reason,
    amount: debtCard.amount,
    paid: debtCard.paid,
    createdAt: debtCard.createdAt,
    updatedAt: debtCard.updatedAt
  };
  return !json ? JSON.stringify(data) : data;
}

export const debtCardList = (debtCards: DebtCard[] | null): DebtCard[] => {
  const _debtCards: any[] = [];
  if (debtCards) {
    debtCards.forEach((card) => _debtCards.push(jsonifyDebtCard(card)));
  }
  return _debtCards;
}

export const jsonifyUser = (user: User, json: boolean = true): any => {
  const data = {
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    email: user.email || null,
  };
  return !json ? JSON.stringify(data) : data;
}

export const validateRequest = (req: Request, res: Response): Response | void  => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}
