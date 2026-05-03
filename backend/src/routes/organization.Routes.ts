import { Router } from "express";
import { getOrganizationsController, addOrganizationController } from "../controllers/organization.Controller";


const organizations = Router();
organizations.get("/", getOrganizationsController);
organizations.post("/", addOrganizationController);
export default organizations;