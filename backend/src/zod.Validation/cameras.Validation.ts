import z from "zod"

export const addCameraValidation = z.object({
    name: z.string().min(2).max(100), 
    location: z.string().max(200),
    streamUrl: z.string()

})

export const updateCameraStatusValidation = z.object({
    id: z.string(),
    isActive: z.boolean()
})

export const getCamerasValidation = z.object({
    location: z.string().optional()
})