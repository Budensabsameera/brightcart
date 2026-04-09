import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    if (event.target.name === "password") {
      setPasswordError("");
    }

    if (event.target.name === "confirmPassword") {
      setConfirmPasswordError("");
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
    const nextConfirmPasswordError =
      formState.password !== formState.confirmPassword
        ? "Passwords do not match"
        : "";

    console.log("[SignupPage] submit", {
      email: formState.email,
      name: formState.name,
      passwordLength: formState.password.length,
      confirmPasswordLength: formState.confirmPassword.length
    });

    if (nextPasswordError || nextConfirmPasswordError) {
      setPasswordError(nextPasswordError);
      setConfirmPasswordError(nextConfirmPasswordError);
      setError("");
      return;
    }

    setError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setIsSubmitting(true);

    try {
      const authResponse = await signup({
        name: formState.name,
        email: formState.email,
        password: formState.password
      });
      console.log("[SignupPage] signup success", { email: formState.email });
      navigate(authResponse.user?.role === "admin" ? "/admin" : "/cart", { replace: true });
    } catch (submissionError) {
      console.error("[SignupPage] signup failed", submissionError);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="section-kicker">Signup</span>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Create your account to shop, save products, manage your cart, and place orders.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </label>

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
                placeholder="Create a password"
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

          <label className="auth-field">
            <span>Confirm Password</span>
            <div
              className={`auth-password-wrap${
                confirmPasswordError ? " auth-password-wrap-error" : ""
              }`}
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                aria-invalid={Boolean(confirmPasswordError)}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPasswordError ? (
              <p className="auth-error auth-field-error">{confirmPasswordError}</p>
            ) : null}
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <Button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p className="auth-switch">
          Want to sell on BrightCart? <Link to="/business-account">Create a business account</Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
