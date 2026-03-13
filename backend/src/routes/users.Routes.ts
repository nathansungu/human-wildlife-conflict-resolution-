import {
  addUserController,
  updateUserController,
  getUsersController,
  subscribeController,
} from "../controllers/users.Controller";

import Route from "express";
import {
  checkAdmin,
  checkAuthentication,
} from "../middlewares/checkAuthentication.Middleware";

const users = Route();

users.post("/register", checkAuthentication, checkAdmin, addUserController);
users.post("/subscribe", subscribeController);
users.patch("/", checkAuthentication, checkAdmin, updateUserController);
users.get("/", checkAuthentication, checkAdmin, getUsersController);

export default users;
