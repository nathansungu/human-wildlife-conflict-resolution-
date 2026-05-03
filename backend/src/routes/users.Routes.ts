import {
  addUserController,
  updateUserController,
  getUsersController,
  subscribeController,
  loginController,
  refreshTokenController,
  loggedInUSerController,
  getSubscribersController,
  updateSubscriberController
} from "../controllers/users.Controller";

import Route from "express";
import {
  authorizeRoles,
  checkAuthentication,

} from "../middlewares/checkAuthentication.Middleware";

const users = Route();

users.post("/register", addUserController);
users.post("/login", loginController);
users.post("/refresh-token", refreshTokenController);
users.post("/subscribe", subscribeController);
users.get("/subscribers", checkAuthentication, authorizeRoles("admin", "superadmin"), getSubscribersController);
users.patch("/", checkAuthentication, authorizeRoles("admin", "superadmin"), updateUserController);
users.get("/", checkAuthentication, authorizeRoles("admin", "superadmin"), getUsersController);
users.get("/me", checkAuthentication, loggedInUSerController);
users.patch("/subscriber", checkAuthentication, authorizeRoles("admin", "superadmin"), updateSubscriberController);

export default users;
