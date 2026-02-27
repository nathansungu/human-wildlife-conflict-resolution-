import {
  allCamerasService,
  addCameraService,
  changeCameraStatus,
} from "../services/cameras.Service";
import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { addCameraValidation, getCamerasValidation, updateCameraStatusValidation } from "../zod.Validation/cameras.Validation";

export const allCamerasController = asyncHandler(
  async (req: Request, res: Response) => {
    const cameras = await allCamerasService();
    res.json(cameras);
  },
);

export const addCameraControler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, location, streamUrl } = await addCameraValidation.parseAsync(
      req.body,
    );
    const camera = await addCameraService(name, location, streamUrl);

    if (camera){
      res.status(200).json({"message": "camera added succesfully"})
    }
    return
  },
);

export const updateCameraStatusController=asyncHandler(
  async(req:Request, res:Response)=>{
    const {id, isActive}= await updateCameraStatusValidation.parseAsync(req.body)
    const newStatus = await changeCameraStatus(id, isActive)
    if(newStatus){
      res.status(200).json({"message": "status updated succesfully"})
    }
  }
)

