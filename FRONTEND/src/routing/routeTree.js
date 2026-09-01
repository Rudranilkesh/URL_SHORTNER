import { createRootRoute } from '@tanstack/react-router';
import RootLayout from '../RootLayout';
import { homeRoute } from './homepage';
import { authRoute } from './auth.route';
import { dashboardRoute } from './dashboard';

export const rootRoute = createRootRoute({
    component: RootLayout
});

export const routeTree = rootRoute.addChildren([
    authRoute,
    homeRoute,
    dashboardRoute
])


