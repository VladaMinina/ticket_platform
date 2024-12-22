import { requireAuth, validateRequest } from '@vm-kvitki/common-lib';
import { deleteOrderController } from '../controllers/delete-controller';
import express from 'express';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, validateRequest, deleteOrderController);

export {router as deleteOrderRouter}