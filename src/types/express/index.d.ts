declare global {
  namespace Express {
    interface Request {
      user?: {
        [key: string]: any;
      };
      files?: Express.Multer.File[];
    }
  }
}

export {};
