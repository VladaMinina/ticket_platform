import {showOrderController} from '../controllers/show-controller';
import express from 'express';

const router = express.Router();

router.get('/api/orders/:orderId', showOrderController);

export {router as showOrderRouter};