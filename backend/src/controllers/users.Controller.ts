import { addUserService, updateUserService, getUSerService, subscribeService } from "../services/user.Service";
import { Request, Response } from "express";
import {
  addUserValidation,
  updateUserValidation,
  getUserValidation,
  subscribeUserValidation
} from "../zod.Validation/users.Validation";

export const addUserController = async (req: Request, res: Response) => {
  const { phone, name, email, password, roleName } = await addUserValidation.parseAsync(req.body);
  const newUser = await addUserService(phone, name, email, password, roleName);
  res.status(201).json(newUser);
};

export const subscribeController = async (req: Request, res: Response) => {
  const { phone, name, email } = await subscribeUserValidation.parseAsync(req.body);
  const newUser = await subscribeService(phone, name, email);
  res.status(201).json(newUser);
};


export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { phone, name, email, role, password } =
    await updateUserValidation.parseAsync(req.body);
  const updatedUser = await updateUserService(
    id,
    name,
    email,
    password,
    role,
    phone

  );
  res.status(200).json(updatedUser);
};


export const getUsersController = async (req: Request, res: Response) => {
  const { id } = await getUserValidation.parseAsync(req.query);
  const users = await getUSerService(id);
  res.status(200).json(users);
}