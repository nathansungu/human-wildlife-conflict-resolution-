import {z} from "zod";

export const createOrganizationValidation = z.object({
    name: z.string().min(1, "Name is required"),
});

