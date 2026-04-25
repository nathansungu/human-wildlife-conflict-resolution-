export interface UserPayload {
  id: string;
  name: string;
  roleName: string;  
  organizationId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;  
      token?: string;     
    }
  }
}

export {};
