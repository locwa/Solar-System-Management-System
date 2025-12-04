import express from 'express';
import * as citizenController from '../controllers/citizenController';
import * as proposalController from '../controllers/proposalController';
import { authenticateSession, checkRole } from '../middleware/sessionAuth';

const router = express.Router();

// Planetary Leader Routes
router.get('/planets/:planetId/citizens',
  authenticateSession,
  checkRole(['Planetary Leader']),
  citizenController.listCitizensOnPlanet
);

router.post('/citizens',
  authenticateSession,
  checkRole(['Planetary Leader']),
  citizenController.createCitizen
);

router.delete('/citizens/:citizenId',
  authenticateSession,
  checkRole(['Planetary Leader']),
  citizenController.removeCitizen
);

// Planetary Leader & Citizen Routes
router.get('/citizens/:citizenId',
  authenticateSession,
  checkRole(['Planetary Leader', 'Citizen']),
  citizenController.getCitizenDetails
);

// Citizen Routes
router.get('/citizens/:citizenId/profile',
  authenticateSession,
  checkRole(['Citizen']),
  citizenController.getCitizenProfile
);

router.post('/citizens/:citizenId/citizenship-request',
  authenticateSession,
  checkRole(['Citizen']),
  citizenController.requestCitizenshipChange
);

router.get('/citizens/:citizenId/citizenship-request',
  authenticateSession,
  checkRole(['Citizen']),
  citizenController.getCitizenshipRequestStatus
);

router.get('/planets/:planetId/modification-requests/:requestId',
  authenticateSession,
  checkRole(['Citizen']),
  proposalController.getModificationRequestDetails
);

router.post('/planets/:planetId/modification-requests/:requestId/vote',
  authenticateSession,
  checkRole(['Citizen']),
  proposalController.castVoteOnRequest
);

export default router;
