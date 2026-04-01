import prismaInstance from "../prismaInstance";
import bcrypt from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export const subscribeService = async (
  phone: string,
  name: string,
  email: string, ) => {
  const newUser = await prismaInstance.user.create({
    data: {
      phone,
      roleName: "user",
      name,
      email,
      subscribed: true,
    },
  });
  if (!newUser) {
    return Promise.reject(new Error("failed to subscribe"));
  }
  return newUser;
};

export const addUserService = async (
  phone: string,
  name: string,
  email: string,
  password: string,
  roleName?: string,
) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  phone = phone.startsWith("+254") ? phone : `+254${phone}`;
  //check if user is a subscriber
  const existingSubscriber = await prismaInstance.user.findFirst({
    where: { email, subscribed: true },
    select: {phone: true}
  });
  // validate is phone number is his
  if (existingSubscriber) {
    if (existingSubscriber.phone !== phone ) {
      return Promise.reject(
        new Error("failed to add user"),
      );
    }
    // update user to add password 
    await prismaInstance.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        roleName: roleName || "user",
        
      },
    });
  }

  const newUser = await prismaInstance.user.create({  
    data: {
      phone,
      roleName: roleName,
      name,
      email,
      password: hashedPassword,
    },
  });
  if (!newUser) {
    return Promise.reject(new Error("failed to add user"));
  }
  return newUser;
}

export const getUSerService = async (id?: string) => {
  const users = await prismaInstance.user.findMany({
    where: {
      id: id && id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      roleName: true,
      subscribed: true,
      createdAt: true,
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
  if (!updatedUser) {
    return Promise.reject(new Error("failed to update user"));
  }
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
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return Promise.reject(new Error("invalid user"));
  }

  // return token
  const accessToken = sign(
    { id: user.id, name: user.name, roleName: user.roleName },
    process.env.JWT_ACCESSTOKEN_SECRET as string,
    { expiresIn: "5m" },
  );
  const refreshToken = sign(
    { id: user.id, name: user.name, roleName: user.roleName },
    process.env.JWT_REFRESHTOKEN_SECRET as string,
    { expiresIn: "1d" },
  );
  return { accessToken, refreshToken };
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = verify(
    refreshToken,
    process.env.JWT_REFRESHTOKEN_SECRET as string,
  ) as JwtPayload;
  const user = await prismaInstance.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) {
    throw new Error("invalid refresh token");
  }
  const { id } = decoded;
  if (!id) {
    throw new Error("invalid refresh token");
  }
  const accessToken = sign(
    { id: user.id, name: user.name, roleName: user.roleName },
    process.env.JWT_ACCESSTOKEN_SECRET as string,
    { expiresIn: "5m" },
  );
  return { accessToken: accessToken };
};

//get logged in user 
export const loggedInUSerService = async(id:string)=>{
  const user = await prismaInstance.user.findUnique({ 
    where: { id }
  });
  if (!user) {
    return Promise.reject(new Error("invalid user"));
  }
  return user;
}
