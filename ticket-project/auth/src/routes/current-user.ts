import express from 'express';
import {currentUser} from '../controllers/current-user-controller';
import {currentUserMid, requireAuth} from '@vm-kvitki/common-lib';

const router = express.Router();

router.get('/api/users/currentuser', currentUserMid, requireAuth, currentUser);

export {router as currentUserRouter};