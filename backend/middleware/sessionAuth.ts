import { Request, Response, NextFunction } from 'express';

module.exports = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).session.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};
