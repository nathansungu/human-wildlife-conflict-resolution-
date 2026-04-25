import { Router } from "express";
import { allCamerasController, addCameraControler, updateCameraStatusController } from "../controllers/cameras.Controller";
import { authorizeRoles, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";

const cameraRoute = Router()

cameraRoute.get("/", allCamerasController)
cameraRoute.post("/",checkAuthentication, authorizeRoles("admin", "superadmin"), addCameraControler)
cameraRoute.put("/", checkAuthentication, authorizeRoles("admin", "superadmin"), updateCameraStatusController)

export default cameraRoute;