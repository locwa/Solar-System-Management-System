import { Request, Response, NextFunction } from 'express';

module.exports = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).session.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!allowedRoles.includes((req as any).session.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
