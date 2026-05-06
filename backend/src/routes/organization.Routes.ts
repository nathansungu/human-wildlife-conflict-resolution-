import { Router } from "express";
import { getOrganizationsController, addOrganizationController } from "../controllers/organization.Controller";
import {checkAuthentication, authorizeRoles} from "../middlewares/checkAuthentication.Middleware";

const organizations = Router();
organizations.get("/", checkAuthentication, getOrganizationsController);
organizations.post("/", checkAuthentication, authorizeRoles("admin", "superadmin"), addOrganizationController);
export default organizations;