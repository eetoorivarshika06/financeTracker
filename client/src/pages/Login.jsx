import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Sparkles, Wallet, ArrowRight } from "lucide-react";
import { loginUser, clearError } from "../redux/authSlice";
import { ROUTES } from "../routes/paths";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Illustration panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between"
      >
        <motion.div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-slate-900 to-purple-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
                FinanceAI
              </div>
            </div>
            <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-slate-100">
              Your finances, intelligently managed.
            </h2>
            <p className="mt-4 max-w-sm text-slate-400">
              Track spending, set budgets, and get AI-powered insights — all in one elegant dashboard.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: TrendingUp, text: "Real-time financial analytics" },
              { icon: Shield, text: "Bank-grade security mindset" },
              { icon: Sparkles, text: "AI insights tailored to you" },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Decorative chart mockup */}
          <div className="glass mt-12 rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl p-6">
            <div className="mb-4 flex h-24 items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                  className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400">Monthly cash flow overview</p>
          </div>
        </div>
      </motion.div>

      {/* Form panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16"
      >
        <div className="mx-auto w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">Welcome back</h1>
            <p className="mt-2 text-slate-400">Sign in to continue to your dashboard</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {error && <Alert>{error}</Alert>}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-400">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-400">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-8 text-center text-sm text-slate-400"
          >
            Don&apos;t have an account?{" "}
            <Link to={ROUTES.SIGNUP} className="font-semibold text-indigo-400 hover:text-indigo-300">
              Create account
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
