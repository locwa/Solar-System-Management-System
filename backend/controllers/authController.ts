import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { validationResult } from "express-validator";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: string;
      isGalactic: boolean;
    };
  }
}

// Register new user
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, fullName, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      Username: username,
      Password: hashedPassword,
      FullName: fullName,
      Role: role || "Citizen", // Default role
    });
    res.status(201).json({ message: "User registered successfully", userId: user.UserID });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set user in session
    req.session.user = {
      id: user.UserID,
      username: user.Username,
      role: user.Role,
      isGalactic: user.Role === "Galactic Leader",
    };

    res.status(200).json({ message: "Logged in successfully", user: req.session.user });
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Logout user
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out, please try again" });
    }
    res.clearCookie("sid"); // Clear session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
};

// Get current user details
export const getMe = (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    // Exclude sensitive information like isGalactic if not needed on frontend
    const { id, username, role } = req.session.user;
    return res.status(200).json({ user: { id, username, role } });
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
};
