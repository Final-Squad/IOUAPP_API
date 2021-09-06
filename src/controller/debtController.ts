import { Router, Request, Response } from "express";
import { body, param, query } from "express-validator";
import DebtCardService from "../service/debtCardService";

const debtCardRoutes: Router = Router();
const debtCardService: DebtCardService = new DebtCardService();

debtCardRoutes
  .route("/")
  .get((req: Request, res: Response) => debtCardService.getAllDebtCards(req, res))
  .post(
    body("payer").isEmail(),
    body("receiver").isEmail(),
    body("reason").exists(),
    body("amount").exists(),
    (req: Request, res: Response) => debtCardService.createDebtCard(req, res)
  );

debtCardRoutes
  .route("/:debtcard_id")
  .get(
    param("debtcard_id").isMongoId().exists(),
    (req: Request, res: Response) => debtCardService.getDebtCardById(req, res))
  .put(
    param("debtcard_id").isMongoId().exists(),
    query("paid").matches(new RegExp('(?:true|false)')).exists().isBoolean(),
    (req: Request, res: Response) => debtCardService.updateDebtCardPaymentStatus(req, res)
  );

debtCardRoutes
    .route("/users/:user_email")
    .get(
      param("user_email").isEmail(),
      query("debt").matches(new RegExp('(?:payer|receiver)')).exists(),
      (req: Request, res: Response) => debtCardService.getDebtCards(req, res)
    );

debtCardRoutes
.route("/users/:user_email/paid")
.get(
  param("user_email").isEmail(),
  (req: Request, res: Response) => debtCardService.getDebtCardsPaidToOrByUser(req, res)
);

export default debtCardRoutes;
