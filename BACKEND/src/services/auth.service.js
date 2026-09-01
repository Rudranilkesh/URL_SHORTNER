import { createUser, findUserByEmail } from "../dao/user.dao.js";
import { ConflictError, UnauthorizedError, BadRequestError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (password.length < 6) {
        throw new BadRequestError("Password must be at least 6 characters long");
    }

    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) throw new ConflictError("User already exists");

    const newUser = await createUser(cleanName, cleanEmail, password);
    const token = await signToken({ id: newUser._id });
    newUser.password = undefined;
    return { token, user: newUser };
};

export const loginUser = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(cleanEmail);
    if (!user) throw new UnauthorizedError("Invalid Credentials");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new UnauthorizedError("Invalid Credentials");

    const token = signToken({ id: user._id });
    user.password = undefined;

    return { token, user };
};