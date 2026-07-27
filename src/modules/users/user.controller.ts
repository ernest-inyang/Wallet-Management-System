import { Request, Response, NextFunction } from 'express';

import { userService } from './user.service';

import { successResponse } from '@common/utils/response';



export class UserController {

    static async register(req: Request, res: Response, next: NextFunction,) {
        try {
            const result = await userService.register(req.body,);
            return successResponse(res, 'User registered successfully.', result, 201,);

        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
    
        try {
            const result = await userService.login(req.body);
            return successResponse(res, 'Login successful.', result);
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction,) {
        try {
            const result = await userService.getProfile(req.user!.userId);
            return successResponse(res, 'User profile retrieved successfully.', result,);
        } catch (error) {
            next(error);
        }
    
    }

    



}