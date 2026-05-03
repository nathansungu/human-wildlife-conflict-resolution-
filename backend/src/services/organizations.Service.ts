import prisma from "../prismaInstance";

export const getOrganizationsService = async () => {
    const organizations = await prisma.organizations.findMany({
        select: {name: true, id: true}
    });
    return organizations;
};

export const addOrganizationService = async (name: string) => {
    const organization = await prisma.organizations.create({
        data: {name}
    });
    if (!organization) {
        return Promise.reject(new Error("Failed to create organization"));
    }
    return organization;
}