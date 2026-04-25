import { Router } from "express";
import { addRoleController } from "../controllers/roles.Controller";
import {checkAuthentication, authorizeRoles} from "../middlewares/checkAuthentication.Middleware";

const roles = Router();

roles.post("/", checkAuthentication, authorizeRoles("superadmin"), addRoleController);
export default roles;