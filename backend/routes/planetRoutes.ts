import express from 'express';
import { authorizeRoles } from '../middleware/roleAuth';
import { createPlanet, getPlanet, updatePlanet, deletePlanet, assignPlanetaryLeader, listPlanets, getManagedPlanetDetails, listPlanetaryLeaders } from '../controllers/planetController';
import { authenticateSession } from '../middleware/sessionAuth';

const router = express.Router();

// Galactic Leader Routes
router.post('/', authenticateSession, authorizeRoles(['Galactic Leader']), createPlanet);
router.get('/', authenticateSession, authorizeRoles(['Galactic Leader']), listPlanets);
router.get('/planetary-leaders', authenticateSession, authorizeRoles(['Galactic Leader']), listPlanetaryLeaders); // Route for listing planetary leaders
router.get('/:planetId', authenticateSession, authorizeRoles(['Galactic Leader', 'Planetary Leader', 'Citizen']), getPlanet);
router.put('/:planetId', authenticateSession, authorizeRoles(['Galactic Leader']), updatePlanet);
router.delete('/:planetId', authenticateSession, authorizeRoles(['Galactic Leader']), deletePlanet);
router.post('/:planetId/leader', authenticateSession, authorizeRoles(['Galactic Leader']), assignPlanetaryLeader);

// Planetary Leader Routes
router.get('/:planetId/details', authenticateSession, authorizeRoles(['Planetary Leader']), getManagedPlanetDetails); // Using getManagedPlanetDetails for details
// router.post('/:planetId/modification-requests', authenticateSession, authorizeRoles(['Planetary Leader']), submitModificationRequest);
// router.get('/:planetId/citizens', authenticateSession, authorizeRoles(['Planetary Leader']), getCitizensOnPlanet);

export default router;
