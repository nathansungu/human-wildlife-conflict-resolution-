import {
  addUserController,
  updateUserController,
  getUsersController,
  subscribeController,
  loginController,
  refreshTokenController,
  loggedInUSerController
} from "../controllers/users.Controller";

import Route from "express";
import {
  checkAdmin,
  checkAuthentication,

} from "../middlewares/checkAuthentication.Middleware";

const users = Route();

users.post("/register", addUserController);
users.post("/login", loginController);
users.post("/refresh-token", refreshTokenController);
users.post("/subscribe", subscribeController);
users.patch("/", checkAuthentication, checkAdmin, updateUserController);
users.get("/", checkAuthentication, checkAdmin, getUsersController);
users.get("/me", checkAuthentication, loggedInUSerController);

export default users;
