import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { signupUser, clearError } from "../redux/authSlice";
import { ROUTES } from "../routes/paths";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(signupUser({ name, email, password }));
    if (signupUser.fulfilled.match(result)) {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Create account</h1>
          <p className="mt-2 text-text-muted">Start your financial journey today</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-card p-8 shadow-[var(--shadow-card)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <Alert>{error}</Alert>}

            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">Full name</label>
              <input
                className="finance-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">Email</label>
              <input
                type="email"
                className="finance-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">Password</label>
              <input
                type="password"
                className="finance-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
