import app from './app';
import { env } from '@config/env';
import { logger } from '@config/logger';


const server = app.listen(env.PORT,);
process.on('SIGTERM', () => {
    server.close(() => {
        logger.info(`${env.APP_NAME} server stopped.`,);
        process.exit(0);

    });

},
);