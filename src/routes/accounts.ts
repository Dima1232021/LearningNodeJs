import { Router } from "express";

import { updateUserPreferences } from "../controllers/accounts";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const accountsRoutes: Router = Router();

accountsRoutes.patch('/update-user-preferences', [authMiddleware], errorHandler(updateUserPreferences));

export default accountsRoutes;