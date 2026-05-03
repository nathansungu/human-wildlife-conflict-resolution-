import {
  addUserService,
  updateUserService,
  loggedInUSerService,
  getUSerService,
  loginUserService,
  refreshTokenService,
  subscribeService,
  getSubscribersService,
  updateSubscriberService
} from "../services/user.Service";
import { Request, Response } from "express";
import {
  addUserValidation,
  updateUserValidation,
  getUserValidation,
  subscribeUserValidation,
  loginValidation,
  updateSubscriberValidation,
} from "../zod.Validation/users.Validation";

export const addUserController = async (req: Request, res: Response) => {
  if (req.user?.roleName == "admin") {
    const { phone, name, password, email, roleName } =
      await addUserValidation.parseAsync(req.body);
    const newUser = await addUserService(
      phone,
      name,
      email,
      password,
      roleName,
    );
    res.status(201).json(newUser);
    return;
  } else {
    const { phone, name, email, password } = await addUserValidation.parseAsync(
      req.body,
    );
    const newUser = await addUserService(phone, name, email, password, "user");
    if (!newUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    res.status(201).json({ message: "User created successfully" });
  }
};

// subscribe controllers 
export const subscribeController = async (req: Request, res: Response) => {
  const { phone, name, email, organizationId } = await subscribeUserValidation.parseAsync(
    req.body,
  );
  const newUser = await subscribeService(phone, name, email, organizationId);
  res.status(201).json(newUser);
};

export const getSubscribersController = async (req: Request, res: Response) => {
  const {roleName, organizationId} = req.user!;
  const organizationIdToUse = roleName === "superadmin" ? undefined : organizationId;
  const subscribers = await getSubscribersService(organizationIdToUse);
  res.status(200).json(subscribers);
}

export  const updateSubscriberController = async (req: Request, res: Response) => {
  const { id, name, email, phone, organizationId, isActive, isDeleted } = await updateSubscriberValidation.parseAsync(
    req.body,
  );
  const updatedSubscriber = await updateSubscriberService(id, name, email, phone, organizationId, isActive, isDeleted );
  res.status(200).json(updatedSubscriber);
};


export const updateUserController = async (req: Request, res: Response) => {
  const { phone, name, email, roleName, password, subscribed,id } =
    await updateUserValidation.parseAsync(req.body);
  const updatedUser = await updateUserService(
    id,
    name,
    email,
    password,
    phone,
    roleName,
    subscribed,
  );
  res.status(200).json(updatedUser);
};

export const getUsersController = async (req: Request, res: Response) => {
  const { id } = await getUserValidation.parseAsync(req.query);
  const isSuperAdmin = req.user?.roleName === "superadmin";
  const organizationId = isSuperAdmin ? undefined : req.user?.organizationId;
  const users = await getUSerService(id, organizationId);
  res.status(200).json(users);
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = await loginValidation.parseAsync(req.body);
  const isValid = await loginUserService(password, email);
  if (isValid) {
    res
      .cookie("accessToken", isValid.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", isValid.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });
    res.status(200);
    return res.json({ message: "Login successful" });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }
  const newAccessToken = await refreshTokenService(refreshToken);
  if (!newAccessToken) {  
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }
  if (newAccessToken) {
    res
      .cookie("accessToken", newAccessToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Access token refreshed successfully" });
    return;
  }
};

export const loggedInUSerController = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await loggedInUSerService(userId);
  res.status(200).json(user);
};
