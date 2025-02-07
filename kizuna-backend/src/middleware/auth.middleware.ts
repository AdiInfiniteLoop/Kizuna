import jwt from 'jsonwebtoken'
import User, { UserInterface } from '../models/userModel.models'
import { Request, Response, NextFunction } from 'express'
import { catchAsync } from '../utils/catchAsync.utils'
import { ErrorClass } from '../utils/errorClass.utills'


interface CustomRequest extends Request {
    user ?: UserInterface | null
}

export const protect = catchAsync(async(req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;
    if(!token) {
        return next(new ErrorClass('Unauthorized - No Token Provided', 401))
    }
 
    if(process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) 
        if (!decoded) {
        return next(new ErrorClass('Unauthorized - Invalid Token Provided', 401))
        }
        if (typeof decoded !== 'object' || !decoded || !('userId' in decoded)) {
            return next(new ErrorClass('Unauthorized - Invalid Token Provided', 401));
        }

        const user = await User.findById(decoded.userId).select('-password')
        if(!user) {
            return next(new ErrorClass('No User available', 400))
        }
        req.user = user
        next()
    }
})
