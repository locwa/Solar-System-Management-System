import express from 'express';
import { authenticateSession } from '../middleware/sessionAuth';
import { authorizeRoles } from '../middleware/roleAuth';
import { submitModificationRequest, getModificationRequestDetails, castVoteOnRequest } from '../controllers/proposalController';

const router = express.Router();

// Planetary Leader Routes
router.post(
  '/planets/:planetId/modification-requests',
  authenticateSession,
  authorizeRoles(['Planetary Leader']),
  submitModificationRequest
);

// Citizen Routes
router.get(
  '/planets/:planetId/modification-requests/:requestId',
  authenticateSession,
  authorizeRoles(['Citizen']),
  getModificationRequestDetails
);
router.post(
  '/planets/:planetId/modification-requests/:requestId/vote',
  authenticateSession,
  authorizeRoles(['Citizen']),
  castVoteOnRequest
);

export default router;
