import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ProfileCard } from "./components/ProfileCard";
import SeatSelector from "./components/SeatSelector";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const COLORS = {
  primary: "#1f4e79",
  primaryDark: "#163a5c",
  accent: "#f5a623",
  bg: "#f4f7fb",
  white: "#ffffff",
  text: "#1a1a1a",
  muted: "#6b7280",
  border: "#d1d5db",
  danger: "#dc2626",
  success: "#16a34a",
};

const RADIUS = { sm: 8, md: 12, lg: 20 };
const SPACING = { xs: 6, sm: 10, md: 16, lg: 24, xl: 40 };

/* ------------------------------------------------------------------ */
/*  REUSABLE: Button                                                   */
/* ------------------------------------------------------------------ */
function Button({ label, onPress, variant = "primary", style, disabled }) {
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={[
        styles.btnBase,
        isOutline && styles.btnOutline,
        isGhost && styles.btnGhost,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          isOutline && { color: COLORS.primary },
          isGhost && { color: COLORS.primary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/*  REUSABLE: Input with optional password toggle + error              */
/* ------------------------------------------------------------------ */
function Input({ label, error, secure, ...props }) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ marginBottom: SPACING.md }}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}

      <View style={[styles.inputWrap, error && styles.inputWrapError]}>
        <TextInput
          style={styles.inputField}
          placeholderTextColor={COLORS.muted}
          secureTextEntry={hidden}
          {...props}
        />

        {secure ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.showText}>{hidden ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  REUSABLE: Screen shell (consistent layout + safe keyboard)         */
/* ------------------------------------------------------------------ */
function Screen({ children, scroll = false, bg = COLORS.bg }) {
  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={styles.screenScrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.screenContent}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: bg }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {inner}
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------ */
/*  SPLASH SCREEN                                                      */
/* ------------------------------------------------------------------ */
function SplashScreen({ onDone }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const onDoneRef = useRef(onDone);

  // keep latest callback without re-running the effect
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => onDoneRef.current?.(), 2500);
    return () => clearTimeout(t);
  }, [fade, scale]);

  return (
    <View
      style={[styles.screen, styles.center, { backgroundColor: COLORS.primary }]}
    >
      <Animated.View
        style={{ opacity: fade, transform: [{ scale }], alignItems: "center" }}
      >
        <Text style={styles.splashLogo}>🚗</Text>
        <Text style={styles.splashTitle}>Lincampride</Text>
        <Text style={styles.splashSubtitle}>Campus rides, made simple</Text>
      </Animated.View>

      <ActivityIndicator
        color={COLORS.white}
        style={{ position: "absolute", bottom: 60 }}
      />

      <StatusBar style="light" />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  WELCOME SCREEN                                                     */
/* ------------------------------------------------------------------ */
function WelcomeScreen({ onStart }) {
  return (
    <Screen bg={COLORS.primary}>
      <View style={styles.welcomeHero}>
        <Text style={styles.welcomeEmoji}>🎓</Text>
        <Text style={styles.welcomeTitle}>Welcome to{"\n"}Lincampride</Text>
        <Text style={styles.welcomeSubtitle}>
          Book seats, share rides, and move around campus with ease.
        </Text>
      </View>

      <View style={styles.welcomeFooter}>
        <Button label="Get Started" onPress={onStart} />
      </View>

      <StatusBar style="light" />
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGIN SCREEN                                                       */
/* ------------------------------------------------------------------ */
function LoginScreen({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) e.email = "Email is required";
    else if (!emailRe.test(email.trim())) e.email = "Enter a valid email";

    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onLogin({ email: email.trim() });
  };

  return (
    <Screen scroll bg={COLORS.white}>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.loginTitle}>Welcome back</Text>
      <Text style={styles.loginSubtitle}>Log in to continue</Text>

      <Input
        label="Email"
        placeholder="you@campus.edu"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          if (errors.email) setErrors((p) => ({ ...p, email: "" }));
        }}
        error={errors.email}
      />

      <Input
        label="Password"
        placeholder="••••••••"
        secure
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          if (errors.password) setErrors((p) => ({ ...p, password: "" }));
        }}
        error={errors.password}
      />

      <Button
        label="Login"
        onPress={submit}
        style={{ marginTop: SPACING.sm }}
      />

      <StatusBar style="dark" />
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/*  DASHBOARD SCREEN                                                   */
/* ------------------------------------------------------------------ */
function DashboardCard({ emoji, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.dashCard}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
    >
      <Text style={styles.dashCardEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.dashCardTitle}>{title}</Text>
        <Text style={styles.dashCardSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.dashCardArrow}>›</Text>
    </TouchableOpacity>
  );
}

function DashboardScreen({ user, onBook, onProfile, onLogout }) {
  const confirmLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: onLogout },
    ]);
  };

  return (
    <Screen scroll bg={COLORS.primary}>
      <Text style={styles.dashGreeting}>Hi 👋</Text>
      <Text style={styles.dashEmail}>{user?.email || "Guest"}</Text>

      <Text style={styles.dashTitle}>What would you like to do?</Text>

      <View style={styles.dashCards}>
        <DashboardCard
          emoji="🚌"
          title="Book a Ride"
          subtitle="Reserve your seat"
          onPress={onBook}
        />
        <DashboardCard
          emoji="👤"
          title="Profile"
          subtitle="View your details"
          onPress={onProfile}
        />
        <DashboardCard
          emoji="🚪"
          title="Log Out"
          subtitle="See you soon"
          onPress={confirmLogout}
        />
      </View>

      <StatusBar style="light" />
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/*  SEAT SELECTOR SCREEN                                               */
/* ------------------------------------------------------------------ */
function SeatsScreen({ onBack }) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ flex: 1 }}>
        <SeatSelector fare={1000} />
      </View>

      <View style={styles.stickyBottom}>
        <Button
          label="← Back to Dashboard"
          variant="outline"
          onPress={onBack}
        />
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  PROFILE SCREEN                                                     */
/* ------------------------------------------------------------------ */
function ProfileScreen({ onBack }) {
  // Guard against missing asset — replace with your real require() once added
  let avatarSource = undefined;
  try {
    avatarSource = require("./assets/pic.jpg");
  } catch (e) {
    avatarSource = undefined;
  }

  return (
    <Screen scroll bg={COLORS.primary}>
      <Text style={styles.profileHeading}>Your Profile</Text>

      <ProfileCard
        name="Zayd Muritala"
        title="Founder, Lincampride"
        avatar={avatarSource}
      />

      <View style={{ marginTop: SPACING.lg }}>
        <Button label="Back" variant="outline" onPress={onBack} />
      </View>

      <StatusBar style="light" />
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT                                                               */
/* ------------------------------------------------------------------ */
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);

  const goWelcome = useCallback(() => setScreen("welcome"), []);
  const goLogin = useCallback(() => setScreen("login"), []);
  const goDashboard = useCallback(() => setScreen("dashboard"), []);
  const goSeats = useCallback(() => setScreen("seats"), []);
  const goProfile = useCallback(() => setScreen("profile"), []);

  const handleLogin = useCallback((u) => {
    setUser(u);
    setScreen("dashboard");
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setScreen("welcome");
  }, []);

  switch (screen) {
    case "splash":
      return <SplashScreen onDone={goWelcome} />;

    case "welcome":
      return <WelcomeScreen onStart={goLogin} />;

    case "login":
      return <LoginScreen onLogin={handleLogin} onBack={goWelcome} />;

    case "dashboard":
      return (
        <DashboardScreen
          user={user}
          onBook={goSeats}
          onProfile={goProfile}
          onLogout={handleLogout}
        />
      );

    case "seats":
      return <SeatsScreen onBack={goDashboard} />;

    case "profile":
      return <ProfileScreen onBack={goDashboard} />;

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  STYLES                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  /* Layout */
  screen: { flex: 1 },
  screenContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: "center",
  },
  screenScrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: "center",
  },
  center: { justifyContent: "center", alignItems: "center" },

  /* Buttons */
  btnBase: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  btnGhost: { backgroundColor: "transparent" },
  btnText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "700",
  },

  /* Inputs */
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    height: 52,
  },
  inputWrapError: { borderColor: COLORS.danger, borderWidth: 2 },
  inputField: { flex: 1, fontSize: 16, color: COLORS.text },
  showText: {
    color: COLORS.primary,
    fontWeight: "700",
    paddingLeft: SPACING.sm,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: SPACING.xs,
  },

  /* Splash */
  splashLogo: { fontSize: 72, marginBottom: SPACING.md },
  splashTitle: {
    fontSize: 38,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontSize: 16,
    color: "#cfe0f2",
    marginTop: SPACING.xs,
  },

  /* Welcome */
  welcomeHero: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeEmoji: { fontSize: 80, marginBottom: SPACING.md },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 42,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#cfe0f2",
    textAlign: "center",
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  welcomeFooter: { paddingBottom: SPACING.lg },

  /* Login */
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  backArrow: { fontSize: 24, color: COLORS.primary, marginRight: SPACING.xs },
  backLabel: { fontSize: 16, color: COLORS.primary, fontWeight: "600" },
  loginTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  loginSubtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: SPACING.xl,
  },

  /* Dashboard */
  dashGreeting: {
    fontSize: 18,
    color: "#cfe0f2",
    marginTop: SPACING.md,
  },
  dashEmail: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: SPACING.xl,
  },
  dashTitle: {
    fontSize: 18,
    color: "#cfe0f2",
    marginBottom: SPACING.md,
  },
  dashCards: { gap: SPACING.md },
  dashCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
  },
  dashCardEmoji: { fontSize: 32 },
  dashCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
  },
  dashCardSubtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  dashCardArrow: { fontSize: 26, color: COLORS.primary, opacity: 0.5 },

  /* Seats */
  stickyBottom: {
    padding: SPACING.md,
    backgroundColor: COLORS.bg,
  },

  /* Profile */
  profileHeading: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
});