import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordOtp, verifyPasswordOtp, resetPassword } = useAuth();
  const [step, setStep] = useState("request");
  const [formState, setFormState] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleChange = (event) => {
    if (event.target.name === "newPassword") {
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

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await requestPasswordOtp(formState.email);
      console.log("[ForgotPasswordPage] OTP requested", response);
      setMessage(response.message);
      setGeneratedOtp(response.otp ?? "");
      setStep("verify");
    } catch (submissionError) {
      console.error("[ForgotPasswordPage] OTP request failed", submissionError);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await verifyPasswordOtp({
        email: formState.email,
        otp: formState.otp
      });
      console.log("[ForgotPasswordPage] OTP verification success", response);
      setMessage(response.message);
      setStep("reset");
    } catch (submissionError) {
      console.error("[ForgotPasswordPage] OTP verification failed", submissionError);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const nextPasswordError = validatePassword(formState.newPassword);
    const nextConfirmPasswordError =
      formState.newPassword !== formState.confirmPassword
        ? "Passwords do not match"
        : "";

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
      const response = await resetPassword({
        email: formState.email,
        otp: formState.otp,
        newPassword: formState.newPassword
      });
      console.log("[ForgotPasswordPage] Password reset success", response);
      navigate("/login", { replace: true });
    } catch (submissionError) {
      console.error("[ForgotPasswordPage] Password reset failed", submissionError);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="section-kicker">Forgot Password</span>
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-subtitle">
          Request an OTP, verify it, and set a new password.
        </p>

        {step === "request" ? (
          <form className="auth-form" onSubmit={handleRequestOtp}>
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

            {message ? <p className="auth-success">{message}</p> : null}
            {error ? <p className="auth-error">{error}</p> : null}

            <Button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : step === "verify" ? (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p className="auth-success">{message}</p>
            {generatedOtp ? <p className="auth-otp-card">OTP: <strong>{generatedOtp}</strong></p> : null}

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
              <span>OTP</span>
              <input
                type="text"
                name="otp"
                value={formState.otp}
                onChange={handleChange}
                placeholder="Enter the OTP"
                required
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <Button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <p className="auth-success">{message}</p>

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
              <span>Verified OTP</span>
              <input type="text" name="otp" value={formState.otp} readOnly />
            </label>

            <label className="auth-field">
              <span>New Password</span>
              <div className={`auth-password-wrap${passwordError ? " auth-password-wrap-error" : ""}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formState.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
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
                  placeholder="Re-enter your new password"
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
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        <p className="auth-switch">
          Remembered it? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
