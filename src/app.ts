import express from "express";
import dotenv from "dotenv";
import path from 'path';
import DB from "./dao/db";
import userRoutes from "./controller/userController";
import debtCardRoutes from "./controller/debtController";
const logger = require("../logger/logger");

// Environmental variables
dotenv.config();

const port: number = parseInt(<string>process.env.PORT) || 3000;
const host: string = process.env.HOST || "localhost";

// Application Configurations
const app: express.Application = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/debtcards", debtCardRoutes);
const isConnected = DB.connect();

app.get("/", (req: express.Request, res: express.Response) =>
  res.redirect("/healthcheck")
);

app.get("/iouapp_api", (req: express.Request, res: express.Response) =>
  res.sendFile(path.join(__dirname+'/iouapp_api.html'))
);

app.get("/healthcheck", async (req: express.Request, res: express.Response) => {
  const status: number = await isConnected ? 200 : 400;
  res.status(status).send({ status });
});

app.listen(port, host, () => {
  logger.info(`🚀 on http://${host}:${port} ✅`, {
    environment: process.env.NODE_ENV,
  });
});
