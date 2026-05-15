import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../routes/paths";
import Loader from "./Loader";

function PublicRoute() {
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return <Loader label="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
