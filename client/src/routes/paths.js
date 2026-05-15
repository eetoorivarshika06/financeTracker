export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  BUDGET: "/budget",
  INSIGHTS: "/insights",
  REPORTS: "/reports",
  PROFILE: "/profile",
};

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.SIGNUP];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.TRANSACTIONS,
  ROUTES.BUDGET,
  ROUTES.INSIGHTS,
  ROUTES.REPORTS,
  ROUTES.PROFILE,
];
