import { lazy, Suspense, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { useServerTime } from "@/hooks/useServerTime";
import { TARGET_DATE } from "@/config";
import Layout from "../components/Layout.tsx";
import SessionManager from "../components/SessionManager.tsx";
import DimensionalDriftLoader from "../components/loader/DimensionalDriftLoader.tsx";
import ChampionshipPage from "../pages/ChampionshipPage.jsx";
import ArchiveNoticePage from "../archive/ArchiveNoticePage";
import ArchiveUnavailablePage from "../archive/ArchiveUnavailablePage";
import { archiveSnapshot, isArchiveMode } from "../archive/archive";

// Lazy load pages
const HomePage = lazy(() => import("../pages/HomePage.tsx"));
const ContactPage = lazy(() => import("../pages/ContactPage.tsx"));
const AboutPage = lazy(() => import("../pages/AboutPage.tsx"));
const EventsPage = lazy(() => import("../pages/EventsPage.tsx"));
const EventDetailPage = lazy(() => import("../pages/EventDetailPage.tsx"));
const MerchPage = lazy(() => import("../pages/Merch.tsx"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPolicyPage.tsx"));
const RegisterPage = lazy(() => import("../pages/RegisterPage.tsx"));
const AccommodationPage = lazy(() => import("../pages/AccommodationPage.tsx"));
const TechTeamPage = lazy(() => import("../pages/techteam.tsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.tsx"));
const FacultyRegistrationsPage = lazy(
  () => import("../pages/FacultyRegistrations.tsx"),
);
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const PronitePage = lazy(() => import("../pages/PronitePage"));
const Gallery = lazy(() => import("../pages/Gallery.tsx"));
const FeedbackPage = lazy(() => import("../pages/FeedbackPage.tsx"));
const GuidelinesRegulations = lazy(
  () => import("@/pages/GuidelinesRegulations.tsx"),
);
const Leaderboard = lazy(() => import("@/pages/Leaderboard.tsx"));
const QuizPage = lazy(() => import("../pages/QuizPage.tsx"));
const TermsAndConditionsPage = lazy(
  () => import("@/pages/TermsAndConditions.tsx"),
);
const RefundPolicy = lazy(() => import("@/pages/RefundPolicyPage.tsx"));
const ProniteRules = lazy(() => import("@/pages/ProniteRules.tsx"));
const CountdownPage = lazy(() => import("../pages/CountdownPage.tsx"));

// Helper components remain the same
const AuthRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    window.location.href = "/";
    return null;
  }

  window.location.href = `${import.meta.env.VITE_AUTH_URL}/?redirect=${encodeURIComponent(
    window.location.origin,
  )}`;
  return null;
};

const ResetRedirect = () => {
  window.location.href = `${import.meta.env.VITE_AUTH_URL}/reset-password${
    window.location.search
  }`;
  return null;
};

const RulebookRedirect = () => {
  window.location.href =
    "https://9ec732lutu.ufs.sh/f/aVR2JOdkpmeKJk08vMK18JTxpAImc3tzOLRfqsZHurSbkMDB";
  return null;
};

// Loading fallback
const PageLoader = () => {
  const location = useLocation();
  const isWormholePage =
    location.pathname === "/" || location.pathname === "/countdown";

  if (isWormholePage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black" />
    );
  }

  return <DimensionalDriftLoader />;
};

function AppRoutes() {
  const { now: serverNow } = useServerTime();
  const now = serverNow ?? Date.now();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If loading, we trust the fallback 'now' (local time) initially to be responsive.
    // Once server time loads, it will correct if there's a discrepancy.
    if (now && now < TARGET_DATE.getTime()) {
      if (location.pathname !== "/countdown") {
        navigate("/countdown");
      }
    } else {
      if (location.pathname === "/countdown") {
        navigate("/");
      }
    }
  }, [now, location.pathname, navigate]);

  if (isArchiveMode) {
    if (!archiveSnapshot) return <ArchiveUnavailablePage />;

    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pronite" element={<PronitePage />} />
          <Route element={<Layout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/guidelines-regulations" element={<GuidelinesRegulations />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/pronite-rules" element={<ProniteRules />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/tech-team" element={<TechTeamPage />} />
            <Route path="/championship" element={<ChampionshipPage />} />
            <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
            <Route path="/contact-us" element={<ArchiveNoticePage />} />
            <Route path="/login" element={<ArchiveNoticePage />} />
            <Route path="/reset-password" element={<ArchiveNoticePage />} />
            <Route path="/register" element={<ArchiveNoticePage />} />
            <Route path="/accommodation" element={<ArchiveNoticePage />} />
            <Route path="/faculty-registrations" element={<ArchiveNoticePage />} />
            <Route path="/merch" element={<ArchiveNoticePage />} />
            <Route path="/feedback" element={<ArchiveNoticePage />} />
            <Route path="/leaderboard" element={<ArchiveNoticePage />} />
            <Route path="/quiz/:quizId" element={<ArchiveNoticePage />} />
            <Route path="/profile" element={<ArchiveNoticePage />} />
            <Route path="/rulebook" element={<ArchiveNoticePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  // If we are in the "countdown phase", only render the CountdownPage for the /countdown route
  if (now && now < TARGET_DATE.getTime()) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/countdown" element={<CountdownPage />} />
          <Route path="*" element={<CountdownPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <SessionManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pronite" element={<PronitePage />} />
          <Route element={<Layout />}>
            <Route path="/contact-us" element={<ContactPage />} />
            <Route
              path="/contact"
              element={<Navigate to="/contact-us" replace />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route
              path="/guidelines-regulations"
              element={<GuidelinesRegulations />}
            />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />
            <Route path="/login" element={<AuthRedirect />} />
            <Route path="/reset-password" element={<ResetRedirect />} />
            <Route path="/rulebook" element={<RulebookRedirect />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/accommodation" element={<AccommodationPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/tech-team" element={<TechTeamPage />} />
            <Route
              path="/faculty-registrations"
              element={<FacultyRegistrationsPage />}
            />

            <Route path="/gallery" element={<Gallery />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/pronite-rules" element={<ProniteRules />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/championship" element={<ChampionshipPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default AppRoutes;
