import { addUserController, updateUserController, getUsersController } from "../controllers/users.Controller";

import Route from "express"

const users = Route()

users.post("/",addUserController)
users.patch("/", updateUserController)
users.get("/", getUsersController)

export default users