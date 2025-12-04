import { Request, Response } from 'express';
import Planet from '../models/Planet';
import User from '../models/User';
import PlanetaryLeader from '../models/PlanetaryLeader';

// Create a new planet (Galactic Leader only)
export const createPlanet = async (req: Request, res: Response) => {
  try {
    // Assuming res.locals.user has a 'role' property from the session
    if (res.locals.user.role !== 'Galactic Leader') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const planet = await Planet.create(req.body);
    res.status(201).json(planet);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update planet attributes (Galactic Leader or Planetary Leader of the planet)
export const updatePlanet = async (req: Request, res: Response) => {
  try {
    const planet = await Planet.findByPk(req.params.id);
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }

    // Access user role and ID from res.locals.user (session data)
    const userRole = res.locals.user.role;
    const userId = res.locals.user.id;

    let isAuthorized = false;
    if (userRole === 'Galactic Leader') {
      isAuthorized = true;
    } else if (userRole === 'Planetary Leader') {
      const planetaryLeader = await PlanetaryLeader.findOne({
        where: {
          LeaderID: userId,
          PlanetID: planet.PlanetID,
        },
      });
      if (planetaryLeader) {
        isAuthorized = true;
      }
    }

    if (isAuthorized) {
      await planet.update(req.body);
      res.json(planet);
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get planet details
export const getPlanet = async (req: Request, res: Response) => {
  try {
    const planet = await Planet.findByPk(req.params.id);
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
    }
    res.json(planet);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// List all planets
export const listPlanets = async (req: Request, res: Response) => {
  try {
    const planets = await Planet.findAll();
    res.json(planets);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};
