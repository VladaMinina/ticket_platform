import { deleteOrderController } from '../controllers/delete-controller';
import express from 'express';

const router = express.Router();

router.delete('/api/orders/:orderId', deleteOrderController);

export {router as deleteOrderRouter}