import { Router } from "express";
import { getDetectionsController, recordDetectionController, verifyDetectionServiceController } from "../controllers/detection.Controller";

const detectionRoute = Router()

detectionRoute.get("/", getDetectionsController)
detectionRoute.post("/", recordDetectionController)
detectionRoute.put("/", verifyDetectionServiceController)

export default detectionRoute;