import { redirect } from "@tanstack/react-router";
import { login, logout } from "../store/slice/authSlice";
import { getCurrentUser } from "../api/user.api";

export const checkAuth = async ({ context }) => {
    const { queryClient, store } = context;
    try {
        const user = await queryClient.fetchQuery({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
            staleTime: 0,
        });

        if (!user) {
            store.dispatch(logout());
            throw redirect({ to: "/" });
        }

        store.dispatch(login({ user }));
        return true;
    } catch (error) {
        if (error?.to) throw error;
        store.dispatch(logout());
        console.log("Auth check failed:", error);
        throw redirect({ to: "/" });
    }
};