import { asyncHandler } from "../middlewares/asyncHandler";
import { createRoleService, getAllRolesService } from "../services/roles.Service";
import { Request, Response } from "express";
import { createRoleValidation } from "../zod.Validation/roles.Validation";
export const addRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = await createRoleValidation.parseAsync(req.body);

    const newRole = await createRoleService(name);
    res.status(201).json(newRole);
  },
);

export const getAllRolesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const roles = await getAllRolesService();
    res.status(200).json(roles);
  },
);
