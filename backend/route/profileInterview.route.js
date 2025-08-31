import express from 'express'
import { checkRoleValidity } from '../controller/profileInterview.controller.js';
import secureRoute from '../middleware/secureRoute.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post('/checkRoleValidity', secureRoute, upload.single("file"), checkRoleValidity);


export default router
























