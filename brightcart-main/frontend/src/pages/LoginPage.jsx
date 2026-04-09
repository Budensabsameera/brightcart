import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formState, setFormState] = useState({
    email: "hello@brightcart.in",
    password: "password123"
  });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname ?? null;

  const handleChange = (event) => {
    if (event.target.name === "password") {
      setPasswordError("");
    }

    setFormState((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password cannot be empty";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextPasswordError = validatePassword(formState.password);

    console.log("[LoginPage] submit", {
      email: formState.email,
      passwordLength: formState.password.length,
      redirectTo
    });

    if (nextPasswordError) {
      setPasswordError(nextPasswordError);
      setError("");
      return;
    }

    setError("");
    setPasswordError("");
    setIsSubmitting(true);

    try {
      const authResponse = await login(formState);
      const nextPath = redirectTo ?? (authResponse.user?.role === "admin" ? "/admin" : "/cart");
      console.log("[LoginPage] login success", { email: formState.email, nextPath });
      navigate(nextPath, { replace: true });
    } catch (submissionError) {
      console.error("[LoginPage] login failed", submissionError);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="section-kicker">Login</span>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue shopping and access your cart.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className={`auth-password-wrap${passwordError ? " auth-password-wrap-error" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                aria-invalid={Boolean(passwordError)}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError ? <p className="auth-error auth-field-error">{passwordError}</p> : null}
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <Button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
        <p className="auth-switch">
          Forgot your password? <Link to="/forgot-password">Reset it</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
