import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Mail, User, LogOut, Shield, Settings, Calendar } from "lucide-react";
import { fetchCurrentUser, logout } from "../redux/authSlice";
import { ROUTES } from "../routes/paths";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Profile</h1>
        <p className="text-sm text-slate-400">Manage your account settings</p>
      </div>

      <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-4xl font-bold text-white shadow-lg shadow-indigo-500/30"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-2xl font-bold text-slate-100"
          >
            {user?.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mt-1 text-slate-400"
          >
            {user?.email}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 space-y-3 text-left"
        >
          <div className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-4 transition hover:bg-slate-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <User className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Full name</p>
              <p className="font-medium text-slate-100">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-4 transition hover:bg-slate-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <Mail className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Email</p>
              <p className="font-medium text-slate-100">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-4 transition hover:bg-slate-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Account status</p>
              <p className="font-medium text-emerald-400">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-4 transition hover:bg-slate-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/20">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Member since</p>
              <p className="font-medium text-slate-100">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8 flex gap-3"
        >
          <Button
            variant="ghost"
            className="flex-1 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="danger"
            className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default Profile;
