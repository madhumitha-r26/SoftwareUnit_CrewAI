import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, public errorCode: string, message: string) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
    });
  }

  console.error('[System Error]:', err);
  return res.status(500).json({
    error: 'SYS_001',
    message: 'Something went wrong, please try again later',
  });
};
