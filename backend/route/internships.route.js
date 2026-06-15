import express from 'express'

import {Router} from 'express'
import {recommendInternships, getRecommendedInternships, getLocations} from '../controller/internships.controller.js'
import secureRoute from '../middleware/secureRoute.js';

const router = Router();

router.post(
  "/recommended",
  secureRoute,
  getRecommendedInternships
);

router.post(
  "/recommend",
  secureRoute,
  recommendInternships
);

router.post(
  "/get-locations",
  secureRoute,
  getLocations
);

export default router;





