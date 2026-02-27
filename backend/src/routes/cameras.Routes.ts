import { Router } from "express";
import { allCamerasController, addCameraControler, updateCameraStatusController } from "../controllers/cameras.Controller";

const cameraRoute = Router()

cameraRoute.get("/", allCamerasController)
cameraRoute.post("/", addCameraControler)
cameraRoute.put("/", updateCameraStatusController)

export default cameraRoute;