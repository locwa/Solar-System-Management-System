import express from 'express';
import * as planetController from '../controllers/planetController';
import { authenticateSession, checkRole } from '../middleware/sessionAuth';

const router = express.Router();

// Planet CRUD routes
router.post('/planets', 
  authenticateSession,
  checkRole(['Galactic Leader']),
  planetController.createPlanet
);

router.put('/planets/:id', 
  authenticateSession,
  planetController.updatePlanet // Has internal role validation
);

router.get('/planets/:id', planetController.getPlanet);
router.get('/planets', planetController.listPlanets);

export default router;
