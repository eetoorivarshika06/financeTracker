import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Mail, User, LogOut, Shield } from "lucide-react";
import { fetchCurrentUser, logout } from "../redux/authSlice";
import { ROUTES } from "../routes/paths";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/Loader";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  if (loading && !user) {
    return <Loader label="Loading profile..." />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" description="Manage your account settings" />

      <Card className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-4xl font-bold text-white shadow-lg shadow-primary/30"
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </motion.div>

        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
        <p className="mt-1 text-text-muted">{user?.email}</p>

        <div className="mt-8 space-y-3 text-left">
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-text-muted">Full name</p>
              <p className="font-medium text-white">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4">
            <Mail className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs text-text-muted">Email</p>
              <p className="font-medium text-white">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4">
            <Shield className="h-5 w-5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">Account status</p>
              <p className="font-medium text-success">Active</p>
            </div>
          </div>
        </div>

        <Button variant="danger" className="mt-8 w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </Card>
    </div>
  );
}

export default Profile;
