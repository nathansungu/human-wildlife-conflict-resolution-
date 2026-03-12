import z from "zod"

export const getDetectionValidation = z.object({
    cameraId: z.string().optional(),
    spiciesId: z.string().optional()
})

export const verifyDetectionValidation = z.object({
    id: z.string(),
    isVerified: z.boolean()
})

export const recordDetectionValidation = z.object({
    cameraId: z.string(),
    spiciesId: z.string(),
    confidence: z.float32()
})

export const getDailyReportValidation = z.object({
    date: z.date().optional()
})