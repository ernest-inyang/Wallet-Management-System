import { User } from './user.types';

export function toUserResponse(user: User) {

    return {

        id: user.id,
        uuid: user.uuid,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        created_at: user.created_at,

    };

}