import { asyncHandler } from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import {
  allDetectionsService,
  verifyDetectionService,
  recordDetectionService,
} from "../services/detection.Service";
import { getDetectionValidation, recordDetectionValidation, verifyDetectionValidation } from "../zod.Validation/detection.Validation";
import { da } from "zod/v4/locales";
export const getDetectionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getDetectionValidation.parseAsync(req.body);
    const detections = await allDetectionsService(
      data.spiciesId,
      data.cameraId,
    );
    res.status(200).json(detections);
  },
);

export const recordDetectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await recordDetectionValidation.parseAsync(req.body);
    const newRecord = await recordDetectionService(
      data.spiciesId,
      data.cameraId,
      data.confidence
    );
    res.status(201).json(newRecord);
  },
);

export const verifyDetectionServiceController = asyncHandler(
    async (req: Request, res: Response) => {
        const data = await verifyDetectionValidation.parseAsync(req.body);
        const updatedRecord = await verifyDetectionService(
            data.id,
            data.isVerified
        );
        res.status(200).json(updatedRecord);
    },
);