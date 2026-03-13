import { Router } from "express";
import { getDailyReportController, getDetectionsController, recordDetectionController, verifyDetectionServiceController } from "../controllers/detection.Controller";
import { checkAdmin, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";

const detectionRoute = Router()

detectionRoute.get("/detections", getDetectionsController)
detectionRoute.get("/daily-report", getDailyReportController)
detectionRoute.post("/",checkAuthentication, checkAdmin, recordDetectionController)
detectionRoute.put("/",checkAuthentication,checkAdmin, verifyDetectionServiceController)

export default detectionRoute;