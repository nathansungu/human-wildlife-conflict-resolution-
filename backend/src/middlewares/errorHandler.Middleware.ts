// error handler
import  { Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client";
import z, { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ message: "check again your input." });
      return;
    } else if (err.code === "P2025") {
      res.status(404).json({ message: "Resource not found." });
      return;
    } else {
      res.status(500).json({ message: "Internal server error." });
      return;
    }
  } else if (err instanceof ZodError) {
    const prettyError = z.prettifyError(err);
    res.status(400).json({ message: prettyError });
    return;
  } else if (err.message === "invalid user") {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  } else if (err.message === "invalid refresh token") {
    res.status(401).json({ message: "login or refresh required." });
    return;
  }
  else if (err.message === "failed to subscribe") {
    res.status(500).json({ message: "Failed to subscribe." });
    return;
  }else if (err.message === "unauthorized action") {
    res.status(401).json({ message: "Unauthorized action." });
    return;
  }else if (err.message === "failed to add user") {
    res.status(400).json({ message: "User not created." });
    return;
  } else if (err.message === "failed to load users") {
    res.status(500).json({ message: "Failed to load users." });
    return;
  }else if (err.message === "failed to update user") {
    res.status(500).json({ message: "Failed to update user." });
    return;
  }
  else if (err.message === "camera not found") {
    res.status(404).json({ message: "Camera not found." });
    return;
  } else if (err.message === "failed to load records") {
    res.status(500).json({ message: "Failed to load records." });
    return;
  } else if (err.message === "animal not found") {
    res.status(404).json({ message: "Animal not found." });
    return;
  } else if (err.message === "failed to add record") {
    res.status(500).json({ message: "Failed to add record." });
    return;
  } else if (err.message === "failed to add records") {
    res.status(500).json({ message: "Failed to add records." });
    return;
  } else if (err.message === "cameraId is required") {
    res.status(400).json({ message: "cameraId is required." });
    return;
  } else if(err.message === "failed to create role") {
    res.status(500).json({ message: "Failed to create role." });
    return;
  }
  else if(err instanceof  JsonWebTokenError) {
    res.status(401).json({ message: "Invalid token." });
    return;
  }
  else {
    console.error(err);
    res.status(500).json({ message: "Internal server error   .   ", error: err.message });
    return;
  }
};
