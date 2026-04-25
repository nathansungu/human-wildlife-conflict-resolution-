import prisma from "../prismaInstance";

export const getOrganizationsService = async () => {
    const organizations = await prisma.organizations.findMany({
        select: {name: true, id: true}
    });
    return organizations;
};