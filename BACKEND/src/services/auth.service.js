import { createUser,findUserByEmail } from "../dao/user.dao.js"
import { ConflictError, UnauthorizedError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async(name,email,password)=>{
    const user = await findUserByEmail(email)
    if(user) throw new ConflictError("User already exists");


    const newUser = await createUser(name,email,password);
    await newUser.save();
    const token = await signToken({id: newUser._id});
    return token;
}

export const loginUser = async(email,password)=>{
    const user = await findUserByEmail(email);

    const isPasswordValid = await user.comparePassword(password);
    if(!user || !isPasswordValid) throw new UnauthorizedError("Invalid Credentials");

    const token = signToken({id: user._id});
    
    return {token,user};
}