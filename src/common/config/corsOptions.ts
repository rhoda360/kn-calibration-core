import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { allowedOrigins } from './allowed-origins.config';

export const corsOptions: CorsOptions = {
  origin: (
    origin: string,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};
