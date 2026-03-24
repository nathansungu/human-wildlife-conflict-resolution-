import prismaInstance from "../prismaInstance"

export const getDashboardStats = async () => {
    const totalDetections = await prismaInstance.animalLogs.count();
    const totalDetectionsToday = await prismaInstance.animalLogs.count({
        where: {
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        },
    });
    const activeCameras = await prismaInstance.cameras.count({
        where: { isActive: true },
    });
    const verifiedDetections = await prismaInstance.animalLogs.count({
        where: { isVerified: true },
    });
    const pendingReview = await prismaInstance.animalLogs.count({
        where: { status: "PENDING" },
    });

    return {
        totalDetections,
        activeCameras,
        verifiedDetections,
        pendingReview,
        totalDetectionsToday,
    };
}
