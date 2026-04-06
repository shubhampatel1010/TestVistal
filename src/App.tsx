import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import LogPage from './pages/LogPage'
import TrackPage from './pages/TrackPage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import HelpPage from './pages/HelpPage'
import AchievementsPage from './pages/AchievementsPage'
import OnboardingPage from './pages/OnboardingPage'

import Layout from './components/Layout'
import InstallPrompt from './components/InstallPrompt'

import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { Toaster } from "react-hot-toast";
import Terms from './pages/TermsPage'
import PricingPage from './pages/PricingPage'
import PdfViewerPage from './pages/PdfViewerPage'

/* ===============================
   🔐 Protected Route Component
================================ */
function ProtectedRoute({ children }: any) {
  const user = localStorage.getItem('userData')

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

/* ===============================
   🔓 Public Route (redirect if logged in)
================================ */
function PublicRoute({ children }: any) {
  const user = localStorage.getItem('userData')

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/* ===============================
   🚀 Main App
================================ */
function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
      <Routes>

        {/* 🔑 Auth Page */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* 🧠 Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* 📱 Main App Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/pdf-viewer" element={<PdfViewerPage />} />
        </Route>

      </Routes>

      <InstallPrompt />
    </BrowserRouter>
    </>
  )
}

export default App