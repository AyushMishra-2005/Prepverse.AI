import express from 'express'

import {Router} from 'express'
import {getMatchedInternships} from '../controller/internships.controller.js'
import secureRoute from '../middleware/secureRoute.js';

const router = Router();

router.post("/get-recomended-internships", secureRoute, getMatchedInternships);




export default router;





