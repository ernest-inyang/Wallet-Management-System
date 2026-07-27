import 'dotenv/config';
import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),

  PORT: port({
    default: 3000,
  }),

  APP_NAME: str(),

  DB_HOST: str(),

  DB_PORT: port(),

  DB_NAME: str(),

  DB_USER: str(),

  DB_PASSWORD: str(),

  FAKE_AUTH_SECRET: str(),

  ADJUTOR_BASE_URL: str({
    default: '',
  }),

  ADJUTOR_API_KEY: str({
    default: '',
  }),
});