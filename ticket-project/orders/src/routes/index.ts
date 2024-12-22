import exppress from 'express';
import {indexOrderController} from '../controllers/index-controller';
import { requireAuth, validateRequest } from '@vm-kvitki/common-lib';

const router = exppress.Router();

router.get('/api/orders', requireAuth, validateRequest, indexOrderController);

export { router as indexOrderRouter };