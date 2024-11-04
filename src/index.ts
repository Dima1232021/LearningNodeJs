import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import { PORT } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/errors";
import { SignUpSchema } from "./schema/users";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query']
});

app.use(errorMiddleware)

app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`)});