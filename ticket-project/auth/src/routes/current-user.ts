import express from 'express';
import {currentUser} from '../controllers/current-user-controller';
import {currentUserMid} from '../middleware/currrent-user';
import { requireAuth } from '../middleware/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', currentUserMid, requireAuth, currentUser);

export {router as currentUserRouter};