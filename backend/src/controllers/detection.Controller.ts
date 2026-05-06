import { asyncHandler } from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import {
  allDetectionsService,
  verifyDetectionService,
  recordDetectionService,
  getDailyReportService,
  sendNotificationService,
  getReportsService,
  restartDetectionService
} from "../services/detection.Service";
import {
  getDetectionValidation,
  recordDetectionValidation,
  verifyDetectionValidation,
  getDailyReportValidation
} from "../zod.Validation/detection.Validation";
import axios from "axios";
export const getDetectionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getDetectionValidation.parseAsync(req.params);
    console.log(req.user);
    const {roleName} = req.user!;
    const organizationId = roleName === "superadmin" ? undefined : req.user!.organizationId;
    const organizationIdToUse = roleName !== "superadmin" ? undefined : organizationId;
    const detections = await allDetectionsService(
      organizationIdToUse,
      data.spiciesId,
      data.cameraId,
    );
    res.status(200).json(detections);
  },
);

export const getDailyReportController = asyncHandler(
  async (req: Request, res: Response) => {
    // const { date } = await getDailyReportValidation.parseAsync(req.body);
    const report = await getDailyReportService();
    res.status(200).json(report);
  }
);

export const recordDetectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await recordDetectionValidation.parseAsync(req.body);
    const newRecord = await recordDetectionService(
      data.spiciesId,
      data.cameraId,
      data.confidence,
    );
    res.status(201).json(newRecord);
  },
);

export const verifyDetectionServiceController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await verifyDetectionValidation.parseAsync(req.body);
    const updatedRecord = await verifyDetectionService(
      data.id,
      data.isVerified,
    );
    res.status(200).json(updatedRecord);
  },
);

export const sendNotificationController  = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await axios.get("http://localhost:5000/detect-animals");
    const results: Record<string, any[]> = data.data.results;

    for (const [cameraId, detections] of Object.entries(results)) {
      if (data.status == 200 && detections.length > 0) {
        for (const detection of detections) {
          await sendNotificationService(
            detection.class_name,
            cameraId,
            detection.confidence,
          );
          await recordDetectionService(
            detection.class_name,
            cameraId,
            detection.confidence,
          );
        }
      }
    }
    res.status(200).json({ message: "Notifications sent successfully" });
  },
);

export const getAllReportsController = asyncHandler(
  async (req: Request, res: Response) => {
    const reports = await getReportsService();
    res.status(200).json(reports);
  }
);

export const restartDetectionController = asyncHandler(
  async (req: Request, res: Response) => {    
    await restartDetectionService();
    res.status(200).json({ message: "Detection service restarted successfully" });
  }
);