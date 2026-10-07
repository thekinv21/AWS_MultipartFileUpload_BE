import z from 'zod';

import { FILE_KEY_PREFIX } from '@/shared/constants';

/**
 * Dosyalar yalnızca `<prefix>public/` ya da `<prefix>private/` klasörünün doğrudan
 * altında tutulur; farklı bir klasördeki nesnelere erişimi engeller.
 */

export const fileKeySchema = z.string().refine(
  (key) =>
    ['public', 'private'].some((folder) => {
      const path = `${FILE_KEY_PREFIX}${folder}/`;
      const name = key.slice(path.length);

      return key.startsWith(path) && name.length > 0 && !name.includes('/');
    }),
  {
    message: `key must be directly under ${FILE_KEY_PREFIX}public/ or ${FILE_KEY_PREFIX}private/`,
  },
);
