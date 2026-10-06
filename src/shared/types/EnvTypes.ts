import z from 'zod';

import { envSchema } from '../config/EnvSchema';

export type TEnv = z.infer<typeof envSchema>;
