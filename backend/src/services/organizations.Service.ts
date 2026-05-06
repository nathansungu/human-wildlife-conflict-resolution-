import prisma from "../prismaInstance";

export const getOrganizationsService = async (organizationId?:string,) => {
    const organizations = await prisma.organizations.findMany({
        where:{
            id: organizationId&& organizationId
        },
        
    });
    return organizations;
};

export const addOrganizationService = async (name: string, userId?: string) => {
    const organization = await prisma.organizations.create({
        data: {user: {connect: {id: userId}}, name}
    });
    if (!organization) {
        return Promise.reject(new Error("Failed to create organization"));
    }
    return organization;
}