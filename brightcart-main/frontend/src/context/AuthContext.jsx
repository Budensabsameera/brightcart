import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createBusinessAccount as createBusinessAccountRequest,
  fetchProfile,
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  requestPasswordOtp as requestPasswordOtpRequest,
  resetPassword as resetPasswordRequest,
  signup as signupRequest,
  updateProfile as updateProfileRequest,
  verifyPasswordOtp as verifyPasswordOtpRequest
} from "../lib/api";
import { ensureDemoLocalState } from "../lib/demoData";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "brightcart.auth";
const LOCAL_USERS_STORAGE_KEY = "brightcart.auth.users";
const LOCAL_OTP_STORAGE_KEY = "brightcart.auth.otp";
const DEFAULT_USER = {
  id: 1,
  name: "BrightCart User",
  email: "hello@brightcart.in",
  role: "admin",
  phone: "9876543210",
  password: "password123"
};

function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState(null);
  const [authState, setAuthState] = useState(() => {
    const savedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!savedAuth) {
      return { token: null, user: null };
    }

    try {
      return normalizeAuthState(JSON.parse(savedAuth));
    } catch {
      return { token: null, user: null };
    }
  });

  useEffect(() => {
    ensureDemoLocalState();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    if (!authNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAuthNotice(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [authNotice]);

  useEffect(() => {
    if (!authState.token || !authState.user) {
      setAuthLoading(false);
      return;
    }

    if (authState.token.startsWith("local-token-")) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;
    setAuthLoading(true);

    fetchCurrentUser()
      .then((user) => {
        if (!isMounted) {
          return;
        }

        setAuthState((currentState) => {
          if (!currentState.token) {
            return currentState;
          }

          return normalizeAuthState({
            token: currentState.token,
            user
          });
        });
      })
      .catch((error) => {
        console.warn("[Auth] Session restore failed", error);

        if (isMounted) {
          setAuthNotice({
            id: Date.now(),
            message: "Using your saved sign-in on this device"
          });
        }
      })
      .finally(() => {
        if (isMounted) {
          setAuthLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authState.token]);

  const login = async (payload) => {
    console.log("[Auth] Login submit", { email: payload.email });
    setAuthLoading(true);

    try {
      const response = await loginRequest(payload);
      console.log("[Auth] Login API success", response);
      const nextAuthState = normalizeAuthState(response);
      setAuthState(nextAuthState);
      setAuthNotice({
        id: Date.now(),
        message: `Signed in as ${nextAuthState.user?.name ?? "your account"}`
      });
      return nextAuthState;
    } catch (error) {
      console.warn("[Auth] Login API failed, trying local fallback", error);
      const fallbackResponse = loginWithFallback(payload);
      setAuthState(fallbackResponse);
      setAuthNotice({
        id: Date.now(),
        message: `Signed in as ${fallbackResponse.user?.name ?? "your account"}`
      });
      return fallbackResponse;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (payload) => {
    console.log("[Auth] Signup submit", { email: payload.email, name: payload.name });
    setAuthLoading(true);

    try {
      const response = await signupRequest(payload);
      console.log("[Auth] Signup API success", response);
      const nextAuthState = normalizeAuthState(response);
      setAuthState(nextAuthState);
      setAuthNotice({
        id: Date.now(),
        message: `Account created for ${nextAuthState.user?.name ?? "you"}`
      });
      return nextAuthState;
    } catch (error) {
      console.warn("[Auth] Signup API failed, trying local fallback", error);
      const fallbackResponse = signupWithFallback(payload);
      setAuthState(fallbackResponse);
      setAuthNotice({
        id: Date.now(),
        message: `Account created for ${fallbackResponse.user?.name ?? "you"}`
      });
      return fallbackResponse;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    const token = authState.token;
    if (token && !token.startsWith("local-token-")) {
      try {
        await logoutRequest();
      } catch (error) {
        console.warn("[Auth] Logout API failed", error);
      }
    }

    setAuthState({ token: null, user: null });
    setAuthNotice({ id: Date.now(), message: "Logged out successfully" });
  };

  const requestPasswordOtp = async (email) => {
    console.log("[Auth] Forgot password submit", { email });

    try {
      const response = await requestPasswordOtpRequest({ email });
      console.log("[Auth] Forgot password API success", response);
      return response;
    } catch (error) {
      console.warn("[Auth] Forgot password API failed, trying local fallback", error);
      return requestPasswordOtpWithFallback(email);
    }
  };

  const verifyPasswordOtp = async ({ email, otp }) => {
    console.log("[Auth] Verify OTP submit", { email, otpLength: otp.length });

    try {
      const response = await verifyPasswordOtpRequest({ email, otp });
      console.log("[Auth] Verify OTP API success", response);
      return response;
    } catch (error) {
      console.warn("[Auth] Verify OTP API failed, trying local fallback", error);
      return verifyOtpWithFallback({ email, otp });
    }
  };

  const resetPassword = async ({ email, otp, newPassword }) => {
    console.log("[Auth] Reset password submit", {
      email,
      otpLength: otp.length,
      passwordLength: newPassword.length
    });

    try {
      const response = await resetPasswordRequest({ email, otp, newPassword });
      console.log("[Auth] Reset password API success", response);
      return response;
    } catch (error) {
      console.warn("[Auth] Reset password API failed, trying local fallback", error);
      return resetPasswordWithFallback({ email, otp, newPassword });
    }
  };

  const refreshProfile = async () => {
    const profile = await fetchProfile();
    setAuthState((currentState) =>
      normalizeAuthState({
        token: currentState.token,
        user: profile
      })
    );
    return profile;
  };

  const updateProfile = async (payload) => {
    try {
      const response = await updateProfileRequest(payload);
      const nextAuthState = normalizeAuthState({
        token: authState.token,
        user: response
      });
      setAuthState(nextAuthState);
      return response;
    } catch (error) {
      const fallbackResponse = updateProfileWithFallback(payload, authState);
      setAuthState(fallbackResponse);
      return fallbackResponse.user;
    }
  };

  const createBusinessAccount = async (payload) => {
    try {
      const response = await createBusinessAccountRequest(payload);
      const nextAuthState = normalizeAuthState({
        token: authState.token,
        user: response
      });
      setAuthState(nextAuthState);
      return response;
    } catch (error) {
      const fallbackResponse = createBusinessAccountWithFallback(payload, authState);
      setAuthState(fallbackResponse);
      return fallbackResponse.user;
    }
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      authNotice,
      authLoading,
      isAuthenticated: Boolean(authState.token),
      isAdmin: authState.user?.role === "admin",
      isCustomer: authState.user?.role === "user",
      phone: authState.user?.phone ?? "",
      login,
      signup,
      requestPasswordOtp,
      verifyPasswordOtp,
      resetPassword,
      refreshProfile,
      updateProfile,
      createBusinessAccount,
      logout
    }),
    [authLoading, authNotice, authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function loginWithFallback(payload) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const localUsers = readLocalUsers();
  const matchingUser =
    (normalizedEmail === DEFAULT_USER.email && payload.password === DEFAULT_USER.password
      ? DEFAULT_USER
      : null) ??
    localUsers.find(
      (user) => user.email === normalizedEmail && user.password === payload.password
    );

  if (!matchingUser) {
    throw new Error("Invalid email or password");
  }

  return toAuthResponse(matchingUser, "local");
}

function signupWithFallback(payload) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const localUsers = readLocalUsers();
  const emailExists =
    normalizedEmail === DEFAULT_USER.email ||
    localUsers.some((user) => user.email === normalizedEmail);

  if (emailExists) {
    throw new Error(`Email already exists: ${normalizedEmail}`);
  }

  const newUser = {
    id: Date.now(),
    name: payload.name.trim(),
    email: normalizedEmail,
    password: payload.password,
    role: "user"
  };

  const nextUsers = [...localUsers, newUser];
  window.localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(nextUsers));

  return toAuthResponse(newUser, "local");
}

function readLocalUsers() {
  const savedUsers = window.localStorage.getItem(LOCAL_USERS_STORAGE_KEY);

  if (!savedUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(savedUsers);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

function requestPasswordOtpWithFallback(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const localUsers = readLocalUsers();
  const userExists =
    normalizedEmail === DEFAULT_USER.email ||
    localUsers.some((user) => user.email === normalizedEmail);

  if (!userExists) {
    throw new Error(`User not found: ${normalizedEmail}`);
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpStore = readOtpStore();
  const nextOtpStore = { ...otpStore, [normalizedEmail]: otp };
  window.localStorage.setItem(LOCAL_OTP_STORAGE_KEY, JSON.stringify(nextOtpStore));
  console.log("[ForgotPassword OTP]", { email: normalizedEmail, otp });

  return { message: "OTP sent to your email", otp };
}

function verifyOtpWithFallback({ email, otp }) {
  const normalizedEmail = email.trim().toLowerCase();
  const otpStore = readOtpStore();
  const expectedOtp = otpStore[normalizedEmail];

  if (!expectedOtp || expectedOtp !== otp.trim()) {
    throw new Error("Invalid OTP");
  }

  return { message: "OTP verified successfully" };
}

function resetPasswordWithFallback({ email, otp, newPassword }) {
  const normalizedEmail = email.trim().toLowerCase();
  const otpStore = readOtpStore();
  const expectedOtp = otpStore[normalizedEmail];

  if (!expectedOtp || expectedOtp !== otp.trim()) {
    throw new Error("Invalid OTP");
  }

  if (normalizedEmail === DEFAULT_USER.email) {
    DEFAULT_USER.password = newPassword;
  } else {
    const localUsers = readLocalUsers();
    const nextUsers = localUsers.map((user) =>
      user.email === normalizedEmail ? { ...user, password: newPassword } : user
    );
    window.localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  }

  const nextOtpStore = { ...otpStore };
  delete nextOtpStore[normalizedEmail];
  window.localStorage.setItem(LOCAL_OTP_STORAGE_KEY, JSON.stringify(nextOtpStore));

  return { message: "Password reset successful" };
}

function readOtpStore() {
  const savedOtps = window.localStorage.getItem(LOCAL_OTP_STORAGE_KEY);

  if (!savedOtps) {
    return {};
  }

  try {
    const parsedOtps = JSON.parse(savedOtps);
    return parsedOtps && typeof parsedOtps === "object" ? parsedOtps : {};
  } catch {
    return {};
  }
}

function toAuthResponse(user, source) {
  return normalizeAuthState({
    token: `${source}-token-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizeRole(user.role ?? (user.email === "hello@brightcart.in" ? "admin" : "user")),
      phone: user.phone ?? ""
    }
  });
}

function updateProfileWithFallback(payload, authState) {
  if (!authState?.user) {
    throw new Error("You must be logged in");
  }

  const nextUser = {
    ...authState.user,
    name: payload.name.trim(),
    phone: payload.phone?.trim() ?? ""
  };

  if (nextUser.email === DEFAULT_USER.email) {
    DEFAULT_USER.name = nextUser.name;
    DEFAULT_USER.phone = nextUser.phone;
  } else {
    const localUsers = readLocalUsers();
    const nextUsers = localUsers.map((user) =>
      user.email === nextUser.email
        ? { ...user, name: nextUser.name, phone: nextUser.phone }
        : user
    );
    window.localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  }

  return normalizeAuthState({
    token: authState.token,
    user: nextUser
  });
}

function createBusinessAccountWithFallback(payload, authState) {
  if (!authState?.user) {
    throw new Error("You must be logged in");
  }

  const nextUser = {
    ...authState.user,
    role: "admin",
    phone: payload.phone?.trim() || authState.user.phone || ""
  };

  if (nextUser.email === DEFAULT_USER.email) {
    DEFAULT_USER.role = "admin";
    DEFAULT_USER.phone = nextUser.phone;
  } else {
    const localUsers = readLocalUsers();
    const nextUsers = localUsers.map((user) =>
      user.email === nextUser.email
        ? {
            ...user,
            role: "admin",
            phone: nextUser.phone,
            businessAccount: {
              businessName: payload.businessName.trim(),
              businessType: payload.businessType.trim(),
              gstNumber: payload.gstNumber?.trim() ?? ""
            }
          }
        : user
    );
    window.localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  }

  return normalizeAuthState({
    token: authState.token,
    user: nextUser
  });
}

function normalizeAuthState(authState) {
  if (!authState?.token || !authState?.user) {
    return { token: null, user: null };
  }

  return {
    token: authState.token,
    user: {
      ...authState.user,
      role: normalizeRole(
        authState.user.role ??
          (authState.user.email === "hello@brightcart.in" ? "admin" : "user")
      )
    }
  };
}

function normalizeRole(role) {
  const normalizedRole = String(role ?? "").trim().toLowerCase();

  if (normalizedRole === "admin") {
    return "admin";
  }

  if (normalizedRole === "customer" || normalizedRole === "user") {
    return "user";
  }

  return "user";
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
