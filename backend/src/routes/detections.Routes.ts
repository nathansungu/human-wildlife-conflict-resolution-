import { Router } from "express";
import { getDailyReportController, getDetectionsController, recordDetectionController, verifyDetectionServiceController } from "../controllers/detection.Controller";
import { checkAdmin, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";
import  {getDashboardStatsController} from "../controllers/animal.controller"
const detectionRoute = Router()

detectionRoute.get("/", getDetectionsController)
detectionRoute.get("/daily-report", getDailyReportController)
detectionRoute.get("/dashboard-stats",checkAuthentication, getDashboardStatsController)
detectionRoute.post("/",checkAuthentication, checkAdmin, recordDetectionController)
detectionRoute.put("/",checkAuthentication,checkAdmin, verifyDetectionServiceController)

export default detectionRoute;