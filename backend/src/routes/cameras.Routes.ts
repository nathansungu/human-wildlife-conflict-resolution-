import { Router } from "express";
import { allCamerasController, addCameraControler, updateCameraStatusController } from "../controllers/cameras.Controller";
import { checkAdmin, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";

const cameraRoute = Router()

cameraRoute.get("/", allCamerasController)
cameraRoute.post("/",checkAuthentication, checkAdmin, addCameraControler)
cameraRoute.put("/", checkAuthentication, checkAdmin, updateCameraStatusController)

export default cameraRoute;