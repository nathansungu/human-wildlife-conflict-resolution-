// check if user is authenticated

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { UserPayload } from "../../@types/express";

export const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.roleName !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};