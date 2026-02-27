import prismaInstance from "../prismaInstance";
import bcrypt from "bcrypt";

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


export const getUSerService  =async(id?:string)=>{
  const users = await prismaInstance.user.findMany({
    where:{
      id:id && id
    }
  })
  if(!users){
    return Promise.reject(new Error("failed to load users"))
  }
  return users;
}
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

