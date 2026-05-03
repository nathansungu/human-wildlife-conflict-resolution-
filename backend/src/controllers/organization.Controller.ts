import { addOrganizationService, getOrganizationsService } from "../services/organizations.Service";
import { Request, Response } from "express";
import { createOrganizationValidation } from "../zod.Validation/organization.Validation";

export const getOrganizationsController = async (_req: Request, res: Response) => {
    const organizations = await getOrganizationsService();
    res.status(200).json(organizations);
    return;
}

export const addOrganizationController = async (req: Request, res: Response) => {
    const { name } = await createOrganizationValidation.parseAsync(req.body);    
    if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
    }
     await addOrganizationService(name);
    return res.sendStatus(201);
    
}
