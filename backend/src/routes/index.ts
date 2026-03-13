import { Router } from "express";
import camerasRoutes from "./cameras.Routes";
import detectionRoutes from "./detections.Routes";
import users from "./users.Routes";
import roles from "./roles.Routes";
import { checkAdmin, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";
const routes = Router()
routes.use("/camera",camerasRoutes)
routes.use("/detection", detectionRoutes)
routes.use("/user", users)
routes.use("/role", checkAuthentication, checkAdmin, roles)

export default routes