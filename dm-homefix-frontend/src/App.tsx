import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VerifyOtpPage from './pages/auth/VerifyOtpPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import BookingsPage from './pages/dashboard/BookingsPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import NotificationsPage from './pages/dashboard/NotificationsPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import VerificationPage from './pages/dashboard/VerificationPage'
import JobsPage from './pages/dashboard/JobsPage'
import FavoritesPage from './pages/dashboard/FavoritesPage'
import DashboardReviewsPage from './pages/dashboard/ReviewsPage'
import SupportPage from './pages/dashboard/SupportPage'
import ServicesPage from './pages/ServicesPage'
import TechniciansPage from './pages/TechniciansPage'
import BookPage from './pages/BookPage'
import AboutPage from './pages/AboutPage'
import ReviewsPage from './pages/ReviewsPage'
import ContactPage from './pages/ContactPage'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/technicians" element={<TechniciansPage />} />
      <Route path="/book" element={<BookPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth pages */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />

      {/* Dashboard — protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/dashboard/reviews" element={<ProtectedRoute><DashboardReviewsPage /></ProtectedRoute>} />
      <Route path="/dashboard/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/verification" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
      <Route path="/dashboard/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
