import express from 'express';
import { authenticateSession } from '../middleware/sessionAuth';
import { authorizeRoles } from '../middleware/roleAuth';
import {
  createCitizen,
  getCitizenDetails, // Renamed from getCitizenById
  removeCitizen,    // Renamed from deleteCitizen
  requestCitizenshipChange,
  getCitizenshipRequestStatus,
  listCitizensOnPlanet, // Renamed from getCitizensOnPlanet
  getCitizenProfile,
} from '../controllers/citizenController';

const router = express.Router();

// Planetary Leader Routes
router.post(
  '/',
  authenticateSession,
  authorizeRoles(['Planetary Leader']),
  createCitizen
);
router.get(
  '/planet/:planetId',
  authenticateSession,
  authorizeRoles(['Planetary Leader']),
  listCitizensOnPlanet // Using listCitizensOnPlanet
);
router.delete(
  '/:citizenId',
  authenticateSession,
  authorizeRoles(['Planetary Leader']),
  removeCitizen // Using removeCitizen
);

// Citizen Routes
router.post(
  '/:citizenId/citizenship-request',
  authenticateSession,
  authorizeRoles(['Citizen']),
  requestCitizenshipChange
);
router.get(
  '/:citizenId/citizenship-request',
  authenticateSession,
  authorizeRoles(['Citizen']),
  getCitizenshipRequestStatus
);
router.get(
  '/:citizenId/profile',
  authenticateSession,
  authorizeRoles(['Citizen']),
  getCitizenProfile
);

// General Citizen Route (accessible by both Planetary Leader and Citizen for details)
router.get(
  '/:citizenId',
  authenticateSession,
  authorizeRoles(['Planetary Leader', 'Citizen']),
  getCitizenDetails // Using getCitizenDetails
);

export default router;
