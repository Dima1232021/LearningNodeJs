import { Router } from 'express';

import authRoutes from './auth';
import accounts from './accounts'

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/accounts', accounts);

export default rootRouter;