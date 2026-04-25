import { Router } from "express";
import { getOrganizationsController } from "../controllers/organization.Controller";

const organizations = Router();
organizations.get("/", getOrganizationsController);
export default organizations;