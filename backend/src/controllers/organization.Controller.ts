import { getOrganizationsService } from "../services/organizations.Service";
import { Request, Response } from "express";

export const getOrganizationsController = async (_req: Request, res: Response) => {
    const organizations = await getOrganizationsService();
    res.status(200).json(organizations);
    return;
}

