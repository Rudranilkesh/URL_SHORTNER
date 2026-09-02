import axiosInstance from "../utlis/axiosinstance";

export const loginUser = async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", { email, password });
    return data;
};

export const registerUser = async (name, email, password) => {
    const { data } = await axiosInstance.post("/auth/register", { name, email, password });
    return data;
};

export const logoutUser = async () => {
    const { data } = await axiosInstance.get("/auth/logout");
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await axiosInstance.get("/auth/me");
    return data.user;
};

export const getAllUserUrls = async () => {
    const { data } = await axiosInstance.get("/user/urls");
    return data.urls;
};
