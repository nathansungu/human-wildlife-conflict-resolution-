import prisma from '../prismaInstance';

export const createRoleService = async (name: string) => {
  const newRole = await prisma.roles.create({
    data: { name },
  });
  if (!newRole) {
    return Promise.reject(new Error("failed to create role"));
  }
  return newRole;
}

