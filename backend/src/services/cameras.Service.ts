import { ca } from "zod/v4/locales";
import prismaInstance from "../prismaInstance";

export const allCamerasService = async (location?: string) => {
  const cameras = await prismaInstance.cameras.findMany({
    where: {
      ...(location && { location }), isActive: true
    }
  });
  return cameras;
};

export const addCameraService = async (
  name: string,
  location: string,
  streamUrl: string,
) => {
  const cameras = await prismaInstance.cameras.create({
    data: { name, location, streamUrl },
  });
  return cameras;
};

export const changeCameraStatus =async(id:string, status:boolean)=>{
    const camera = await prismaInstance.cameras.update({
      where:{id}, data:{isActive:status}
    })
    if(!camera){
      throw new Error("camera not found")
    }
    return camera
}