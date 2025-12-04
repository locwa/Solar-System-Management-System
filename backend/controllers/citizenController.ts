import { Request, Response } from 'express';
import Citizen from '../models/Citizen';
import Planet from '../models/Planet';
import User from '../models/User';
import CitizenshipRequest from '../models/CitizenshipRequest';
import PlanetaryLeader from '../models/PlanetaryLeader';

// Get a list of all citizens on a specific planet (Planetary Leader only)
export const listCitizensOnPlanet = async (req: Request, res: Response) => {
  try {
    const { planetId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can view citizens on their managed planet' });
    }

    const planetaryLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: planetId,
      },
    });

    if (!planetaryLeader) {
      return res.status(403).json({ error: 'Unauthorized: You are not the leader of this planet' });
    }

    const citizens = await Citizen.findAll({
      where: { PlanetID: planetId },
      include: [{ model: User, as: 'User' }],
    });
    res.json(citizens);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// View details of a specific citizen (Planetary Leader and Citizen themselves)
export const getCitizenDetails = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id; // UserID from session
    const userRole = res.locals.user.role;

    const citizen = await Citizen.findByPk(citizenId, {
      include: [{ model: User, as: 'User' }, { model: Planet, as: 'Planet' }],
    });

    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    // Check authorization
    if (userRole === 'Planetary Leader') {
      // A planetary leader can view any citizen on their planet
      const planetaryLeader = await PlanetaryLeader.findOne({
        where: {
          LeaderID: userId,
          PlanetID: citizen.PlanetID,
        },
      });
      if (!planetaryLeader) {
        return res.status(403).json({ error: 'Unauthorized: You are not the leader of this citizen\'s planet' });
      }
    } else if (userRole === 'Citizen') {
      // A citizen can only view their own details
      if (citizen.UserID !== userId) {
        return res.status(403).json({ error: 'Unauthorized: You can only view your own citizen details' });
      }
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(citizen);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Create a new citizen (Planetary Leader only)
export const createCitizen = async (req: Request, res: Response) => {
  try {
    const { PlanetID, UserID, CitizenName } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can create citizens' });
    }

    const planetaryLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: PlanetID,
      },
    });

    if (!planetaryLeader) {
      return res.status(403).json({ error: 'Unauthorized: You are not the leader of this planet' });
    }

    // Check if the user already has a citizen profile
    const existingCitizen = await Citizen.findOne({ where: { UserID: UserID } });
    if (existingCitizen) {
      return res.status(409).json({ error: 'User is already a citizen' });
    }

    const citizen = await Citizen.create({ PlanetID, UserID, CitizenName });
    res.status(201).json(citizen);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Remove a citizen (Planetary Leader only)
export const removeCitizen = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Planetary Leader') {
      return res.status(403).json({ error: 'Unauthorized: Only Planetary Leaders can remove citizens' });
    }

    const citizen = await Citizen.findByPk(citizenId);
    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    const planetaryLeader = await PlanetaryLeader.findOne({
      where: {
        LeaderID: userId,
        PlanetID: citizen.PlanetID,
      },
    });

    if (!planetaryLeader) {
      return res.status(403).json({ error: 'Unauthorized: You are not the leader of this citizen\'s planet' });
    }

    await citizen.destroy();
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get the citizen's own profile and status (Citizen only)
export const getCitizenProfile = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view their own profile' });
    }

    const citizen = await Citizen.findByPk(citizenId, {
      include: [{ model: User, as: 'User' }, { model: Planet, as: 'Planet' }],
    });

    if (!citizen || citizen.UserID !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Profile not found or does not belong to the authenticated user' });
    }

    res.json(citizen);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Request a change of planetary citizenship (Citizen only)
export const requestCitizenshipChange = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const { newPlanetId } = req.body;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can request citizenship changes' });
    }

    const citizen = await Citizen.findByPk(citizenId);
    if (!citizen || citizen.UserID !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Citizen not found or does not belong to the authenticated user' });
    }

    // Check if new planet exists
    const newPlanet = await Planet.findByPk(newPlanetId);
    if (!newPlanet) {
      return res.status(404).json({ error: 'New planet not found' });
    }

    // Prevent requesting transfer to the same planet
    if (citizen.PlanetID === newPlanetId) {
      return res.status(400).json({ error: 'Cannot request transfer to the current planet' });
    }

    // Check for existing pending request
    const existingRequest = await CitizenshipRequest.findOne({
      where: {
        CitizenID: citizenId,
        Status: 'Pending',
      },
    });

    if (existingRequest) {
      return res.status(409).json({ error: 'Pending citizenship transfer request already exists' });
    }

    const citizenshipRequest = await CitizenshipRequest.create({
      CitizenID: citizenId,
      CurrentPlanetID: citizen.PlanetID,
      RequestedPlanetID: newPlanetId,
      Status: 'Pending', // Default status
      RequestDate: new Date(),
    });

    res.status(201).json(citizenshipRequest);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// View the status of the citizenship transfer request (Citizen only)
export const getCitizenshipRequestStatus = async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;
    const userId = res.locals.user.id;
    const userRole = res.locals.user.role;

    if (userRole !== 'Citizen') {
      return res.status(403).json({ error: 'Unauthorized: Only Citizens can view their citizenship request status' });
    }

    const citizen = await Citizen.findByPk(citizenId);
    if (!citizen || citizen.UserID !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Citizen not found or does not belong to the authenticated user' });
    }

    const requests = await CitizenshipRequest.findAll({
      where: { CitizenID: citizenId },
      include: [
        { model: Planet, as: 'CurrentPlanet' },
        { model: Planet, as: 'RequestedPlanet' },
      ],
      order: [['RequestDate', 'DESC']],
    });

    if (requests.length === 0) {
      return res.status(404).json({ message: 'No citizenship transfer requests found for this citizen' });
    }

    res.json(requests);
  } catch (error: unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
};
