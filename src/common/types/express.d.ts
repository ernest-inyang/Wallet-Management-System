import 'express';

declare global {
  namespace Express {
    interface User {
      userId: number;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};