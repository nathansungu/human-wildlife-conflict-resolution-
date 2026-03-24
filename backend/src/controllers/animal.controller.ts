import { Request, Response } from "express";
import { getDashboardStats } from "../services/animals.Service";
import { asyncHandler } from "../middlewares/asyncHandler";

export const getDashboardStatsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getDashboardStats();
    res.json(stats);
  },
);
