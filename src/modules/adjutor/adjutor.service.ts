import axios from 'axios';

import { env } from '@config/env';

export class AdjutorService {

  async isBlacklisted(identity: string): Promise<boolean> {

    try {

      const response = await axios.get(
        `${env.ADJUTOR_BASE_URL}/verification/karma/${identity}`,
        {
          headers: {
            Authorization: `Bearer ${env.ADJUTOR_API_KEY}`,
          },
        },
      );

      return response.data?.data?.blacklisted === true;

    } catch {

      /**
       * Fail closed.
       * We do not onboard users if
       * Karma verification cannot be completed.
       */

      throw new Error(
        'Unable to verify Adjutor Karma.',
      );
    }
  }
}

export const adjutorService =
  new AdjutorService();