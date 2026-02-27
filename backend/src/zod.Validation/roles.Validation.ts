import z from 'zod';

export const createRoleValidation = z.object({
  name: z.string().min(1, 'Role name is required'),
});