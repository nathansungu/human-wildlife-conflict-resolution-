import { Router } from "express";
import { addRoleController, getAllRolesController} from "../controllers/roles.Controller";
import {checkAuthentication, authorizeRoles} from "../middlewares/checkAuthentication.Middleware";

const roles = Router();

roles.post("/", checkAuthentication, authorizeRoles("superadmin"), addRoleController);
roles.get("/", checkAuthentication, authorizeRoles("superadmin"), getAllRolesController);
export default roles;