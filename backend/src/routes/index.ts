import { Router } from "express";
import camerasRoutes from "./cameras.Routes";
import detectionRoutes from "./detections.Routes";
import users from "./users.Routes";
import roles from "./roles.Routes";
const routes = Router()
routes.use("/camera",camerasRoutes)
routes.use("/detection", detectionRoutes)
routes.use("/user", users)
routes.use("/role", roles)

export default routes