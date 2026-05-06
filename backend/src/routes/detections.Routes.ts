import { Router } from "express";
import { getAllReportsController, getDailyReportController, getDetectionsController, recordDetectionController, restartDetectionController, verifyDetectionServiceController } from "../controllers/detection.Controller";
import { authorizeRoles, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";
import  {getDashboardStatsController} from "../controllers/animal.controller"
const detectionRoute = Router()

detectionRoute.get("/",checkAuthentication, getDetectionsController)
detectionRoute.get("/daily-report", checkAuthentication, getDailyReportController)
detectionRoute.get("/dashboard-stats",checkAuthentication, getDashboardStatsController)
detectionRoute.get("/reports",checkAuthentication, getAllReportsController)
detectionRoute.post("/",checkAuthentication, authorizeRoles("admin", "superadmin"), recordDetectionController)
detectionRoute.put("/",checkAuthentication,authorizeRoles("admin", "superadmin"), verifyDetectionServiceController)
detectionRoute.post("/restart",checkAuthentication,authorizeRoles("admin", "superadmin"), restartDetectionController)

export default detectionRoute;