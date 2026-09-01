import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import HomePage from "../pages/HomePage";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomePage
})