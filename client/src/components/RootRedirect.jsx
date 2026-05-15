import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../routes/paths";
import Loader from "./Loader";

function RootRedirect() {
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return <Loader label="Loading..." />;
  }

  return (
    <Navigate
      to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
      replace
    />
  );
}

export default RootRedirect;
