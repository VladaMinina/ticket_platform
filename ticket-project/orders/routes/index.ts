import exppress from 'express';
import {indexOrderController} from '../controllers/index-controller';

const router = exppress.Router();

router.get('/api/orders', indexOrderController);

export { router as indexOrderRouter };