import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming user information is attached to req.user after authentication
    // req.user might be from a session or JWT payload
    if (!req.session || !req.session.user || !req.session.user.role) {
      return res.status(401).json({ message: 'Unauthorized: No user session found' });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
    }

    next();
  };
};
