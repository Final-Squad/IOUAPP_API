import { Request, Response } from 'express';

import User from "../types/common-interfaces";
import UserDAO from "../dao/userDAO";
import { jsonifyUser, validateRequest } from './utils';
const logger = require("../../logger/logger");

export default class UserServive {
  userDAO: UserDAO;

  constructor(userDAO: UserDAO = new UserDAO()) {
    this.userDAO = userDAO;
  }

  async getAllUsers(res: Response): Promise<Response> {
    const users: User[] | null = await this.userDAO.allUsers();
    if (users) {
      const _users: User[] = [];
      users.forEach(async (user) => _users.push(jsonifyUser(user)));
      return res
        .status(200)
        .json({ length: users.length, users: _users });
    } else {
      return res
        .status(400)
        .json({ error: "UNABLE to get all users from database" });
    }
  }

  async getUser(req: Request, res: Response): Promise<Response> {
    const user: User | null = await this.userDAO.getUserByEmail(req.params.user_email);

    if (user) {
      logger.info({
        message: jsonifyUser(user, false),
        service: "service/users -> getUser",
        environment: process.env.NODE_ENV,
      });
      return res.status(200).json({ user: jsonifyUser(user) });
    } else {
      return res
        .status(400)
        .json({ error: "user with email doesn't exist" });
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    validateRequest(req, res);

    const reqUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    }

    const user = await this.userDAO.createUser(reqUser);
    if (user) {
      logger.info({
        message:
          process.env.NODE_ENV === "development"
            ? jsonifyUser(user, false)
            : "created a new user",
        user: jsonifyUser(user),
        service: "service/users -> createUser",
        environment: process.env.NODE_ENV,
      });
      return res.status(201).json({ user: jsonifyUser(user) });
    } else {
      return res.status(400).json({ error: "UNABLE to save to database" });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const deleted: boolean = await this.userDAO.deleteUser(req.params.user_email);
    return res
      .status(deleted ? 201 : 400)
      .json({ message: deleted ? 'user deleted successfully' : "user with email doesn't exist" });
  }

}
