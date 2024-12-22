import {showOrderController} from '../controllers/show-controller';
import express from 'express';
import {requireAuth, validateRequest} from '@vm-kvitki/common-lib';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, validateRequest,  showOrderController);

export {router as showOrderRouter};