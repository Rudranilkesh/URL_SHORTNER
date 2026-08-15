import { verifyToken } from "../utils/helper.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { findUserById } from "../dao/user.dao.js";

export const authMiddleware = async (req,res,next) =>{
    try {
        const token = req.cookie.accessToken;
        if(!token){
            throw new UnauthorizedError("Unauthorized");
        }
        const decodedToken = verifyToken(token);
        const user = await findUserById(decodedToken.id);
        if(!user){
            throw new UnauthorizedError("Unauthorized");
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}