import { tr } from "zod/v4/locales";
import prismaInstance from "../prismaInstance";
import bcrypt from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export const addUserService = async (
  phone: string,
  name: string,
  email: string,
  password?: string,
) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const newUser = await prismaInstance.user.create({
    data: {
      phone,
      roleName: "user",
      name,
      email,
      password: hashedPassword,
      subscribed: true,
    },
  });
  if (!newUser) {
    return Promise.reject(new Error("failed to add user"));
  }
  return newUser;
};

export const getUSerService = async (id?: string) => {
  const users = await prismaInstance.user.findMany({
    where: {
      id: id && id,
    },
  });
  if (!users) {
    return Promise.reject(new Error("failed to load users"));
  }
  return users;
};
export const updateUserService = async (
  id: string,
  name?: string,
  email?: string,
  password?: string,
  phone?: string,
  roleName?: string,
  subscribed?: boolean,
) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const updatedUser = await prismaInstance.user.update({
    where: { id },
    data: {
      name: name && name,
      email: email && email,
      password: hashedPassword,
      roleName: roleName && roleName,
      phone: phone && phone,
      subscribed: subscribed && subscribed,
    },
  });
  return updatedUser;
};

export const loginUserService = async (
  password: string,
  identifier: string,
) => {
  const user = await prismaInstance.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });
  if (!user) {
    return Promise.reject(new Error("invalid user"));
  }

  if (!user.password) {
    return Promise.reject(new Error("unauthorised action"));
  }
  const isValidPassword = bcrypt.compare(user.password, password);

  if (!isValidPassword) {
    return Promise.reject(new Error("invalid user"));
  }

  // return token
  const accesToken = sign(
    { userId: user.id, name: user.name },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: "1m" },
  );
  const refreshToken = sign(
    { userId: user.id, name: user.name },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" },
  );
  return { accesToken, refreshToken };
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
  ) as JwtPayload;
  const { userId, name } = decoded;
  if (!userId) {
    throw new Error("invalid refresh token");
  }
  const newAccessToken = sign(
    { userId, name },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: "1m" },
  );
  return { accessToken: newAccessToken };
};

