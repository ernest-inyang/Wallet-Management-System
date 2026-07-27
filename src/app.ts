import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

import { logger } from '@config/logger';
import { router } from '@routes/index';
import { notFound } from '@common/middleware/notFound.middleware';
import { errorHandler } from '@common/middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(pinoHttp({ logger,}),);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
  }),
);

app.use(router);
app.use(notFound);
app.use(errorHandler);

export default app;