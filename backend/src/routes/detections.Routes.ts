import { Router } from "express";
import { getAllReportsController, getDailyReportController, getDetectionsController, recordDetectionController, verifyDetectionServiceController } from "../controllers/detection.Controller";
import { checkAdmin, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";
import  {getDashboardStatsController} from "../controllers/animal.controller"
import { de } from "zod/v4/locales";
const detectionRoute = Router()

detectionRoute.get("/", getDetectionsController)
detectionRoute.get("/daily-report", getDailyReportController)
detectionRoute.get("/dashboard-stats",checkAuthentication, getDashboardStatsController)
detectionRoute.get("/reports",checkAuthentication, getAllReportsController)
detectionRoute.post("/",checkAuthentication, checkAdmin, recordDetectionController)
detectionRoute.put("/",checkAuthentication,checkAdmin, verifyDetectionServiceController)

export default detectionRoute;