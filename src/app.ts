import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import routes from './routes';

import { requestLogger } from '@common/middleware/request-logger.middleware';
import { logger } from '@config/logger';
import { notFoundMiddleware } from '@common/middleware/not-found.middleware';
import { errorMiddleware } from '@common/middleware/error.middleware';

const app = express();

app.use(requestLogger); 
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

app.use('/api/v1', routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);


export default app;