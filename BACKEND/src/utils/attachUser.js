import { UnauthorizedError } from "./errorHandler.js";
import { verifyToken } from "./helper.js";
import { findUserById } from "../dao/user.dao.js";

export const attachUser = async (req,res,next) =>{
    const token = req.cookies.accessToken;       
    if(!token){
        return next();
    }
    try {
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