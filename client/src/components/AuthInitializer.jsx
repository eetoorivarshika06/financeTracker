import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, finishInitialization } from "../redux/authSlice";
import Loader from "./Loader";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { token, user, loading, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      dispatch(finishInitialization());
      return;
    }
    if (!user) {
      dispatch(fetchCurrentUser());
    } else {
      dispatch(finishInitialization());
    }
  }, [dispatch, token, user]);

  if (!initialized || (token && !user && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader label="Loading..." />
      </div>
    );
  }

  return children;
}

export default AuthInitializer;
