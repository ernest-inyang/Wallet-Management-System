import app from './app';
import { env } from '@config/env';
import { logger } from '@config/logger';

app.listen(env.PORT, () => {
  logger.info(
    `${env.APP_NAME} running on http://localhost:${env.PORT}`,
  );
});