import { Logger } from '@rohit2005/logger';
import { configEnv } from './env';

export const logger = new Logger({
  logFiles: configEnv.NODE_ENV === 'development' ? false : true,
});
