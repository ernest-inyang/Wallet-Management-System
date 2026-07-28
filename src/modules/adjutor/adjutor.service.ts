import axios, { AxiosError } from 'axios';

import { env } from '@config/env';
import { BadRequestError, ExternalServiceError } from '@common/errors';
import { KarmaVerificationResponse } from './adjutor.types';

export class AdjutorService {

    async validateKarmaBlacklist(identity: string): Promise<void> {
        const url = `${env.ADJUTOR_BASE_URL}/verification/karma/${encodeURIComponent(identity)}`;

        try {
            const { data } = await axios.get<KarmaVerificationResponse>(url, {
                headers: {
                    Authorization: `Bearer ${env.ADJUTOR_API_KEY}`,
                    Accept: 'application/json',
                },
                timeout: 10000,
            });
            const karmaRecord = data.data;

            // No Karma record found
            if (!karmaRecord) {
                return;
            }
            // The test environment always returns a record. Only block onboarding if there is actually money in contention.
            if (Number(karmaRecord.amount_in_contention) > 0) {
                throw new BadRequestError(`User with identity '${identity}' is blacklisted on Lendsqr Karma.`,);
            }
            return;

        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            }

            const axiosError = error as AxiosError;
            console.error('Adjutor API Error:', {
                url,
                message: axiosError.message,
                status: axiosError.response?.status,
                response: axiosError.response?.data,
            });

            throw new ExternalServiceError('Unable to verify user against the Lendsqr Adjutor service.');
        }
    }
}

export const adjutorService = new AdjutorService();