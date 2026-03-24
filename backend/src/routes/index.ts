import { Router } from "express";
import camerasRoutes from "./cameras.Routes";
import detectionRoutes from "./detections.Routes";
import users from "./users.Routes";
import roles from "./roles.Routes";
import { checkAdmin, checkAuthentication } from "../middlewares/checkAuthentication.Middleware";
const routes = Router()
routes.use("/cameras",camerasRoutes)
routes.use("/detections", detectionRoutes)
routes.use("/users", users)
routes.use("/role", checkAuthentication, checkAdmin, roles)

export default routes