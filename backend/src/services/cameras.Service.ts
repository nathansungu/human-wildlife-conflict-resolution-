import prismaInstance from "../prismaInstance";

export const allCamerasService = async (
  location?: string,
  organizationId?: string,
) => {
  const cameras = await prismaInstance.cameras.findMany({
    where: {
      location: location && location,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      location: true,
      streamUrl: true,
      organizationId: true,
      organization: true,
    },
  });
  // filter to only include cameras from organizations with valid subscriptions
  const filteredCameras = cameras.filter((camera) => {
    const org = camera.organization;
    if (!org) return false;
    const now = new Date();
    return (
      org.isActive &&
      org.subscriptionValidUntil &&
      org.subscriptionValidUntil > now
    );
  })
  return { "allCameras":cameras, "filteredCameras": filteredCameras };
};

export const addCameraService = async (
  name: string,
  location: string,
  streamUrl: string,
  organizationId: string,
) => {
  const cameras = await prismaInstance.cameras.create({
    data: { name, location, streamUrl, organizationId },
  });
  return cameras;
};

export const changeCameraStatus = async (id: string, status: boolean) => {
  const camera = await prismaInstance.cameras.update({
    where: { id },
    data: { isActive: status },
  });
  if (!camera) {
    throw new Error("camera not found");
  }
  return camera;
};
