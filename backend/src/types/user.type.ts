// set user type

import { JwtPayload } from "jsonwebtoken";
export interface User {
  id: string;
  name: string;
  roleName: "admin" | "user";
}

declare global {
  namespace Express {
    interface Request {
      user?: User | JwtPayload;
    }
  }
}