import { Router } from 'express';
import { login, verify } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/verify', verifyToken, verify); // Ahora usa la función encapsulada

export default router;