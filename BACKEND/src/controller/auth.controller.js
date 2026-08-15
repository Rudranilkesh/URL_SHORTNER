import { loginUser ,registerUser } from "../services/auth.service.js"
import { wrapAsync } from "../utils/tryCatchWrapper.js";
import { BadRequestError } from "../utils/errorHandler.js";
import { cookieOptions } from "../config/config.js";

export const register_user = wrapAsync(async(req,res)=>{
    const {name, email, password} = req.body;
    if(!name||!email||!password){
        throw new BadRequestError("All fields are required");
    }
    const token = await registerUser(name, email, password);
    req.user = user;
    res.cookie('accessToken',token,cookieOptions)
    res.status(200).json({message:"Login successfull"})
})

export const login_user = wrapAsync(async(req,res)=>{
    const {email,password} = req.body;
    if (!email || !password) {
    throw new BadRequestError("All fields are required");
  }
  const token = await loginUser(email,password);
  req.user = user;
  res.cookie('accessToken',token,cookieOptions)
  res.status(200).json({message:"Login successfull"})

})

export const createCustomUrl = wrapAsync(async(req,res)=>{
    const {url,slug} = req.body;
    if(!url||!slug){
        throw new BadRequestError("All fields are required");
    }

    const shortUrl = await createCustomUrl(url,slug);
    res.status(200).json({message:"Custom URL created successfully",shortUrl});
})
