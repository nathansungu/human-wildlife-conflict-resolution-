import { Router } from "express";
import { addRoleController } from "../controllers/roles.Controller";

const roles = Router();

roles.post("/", addRoleController);

export default roles;