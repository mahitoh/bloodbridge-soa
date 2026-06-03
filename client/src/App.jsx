import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DonorDashboard from './pages/donor/Index'
import NearbyRequests from './pages/donor/Requests'
import DonorHistory from './pages/donor/History'
import DonorProfile from './pages/donor/Profile'
import DonorMap from './pages/donor/Map'
import HospitalDashboard from './pages/hospital/Index'
import HospitalRequests from './pages/hospital/Requests'
import HospitalRequestDetails from './pages/hospital/RequestDetails'
import HospitalDonors from './pages/hospital/Donors'
import PostRequest from './pages/hospital/PostRequest'
import HospitalProfile from './pages/hospital/Profile'
import AdminDashboard from './pages/admin/Index'
import AdminDonors from './pages/admin/Donors'
import AdminHospitals from './pages/admin/Hospitals'
import AdminAnalytics from './pages/admin/Analytics'
import AdminRequests from './pages/admin/Requests'
import AdminSettings from './pages/admin/Settings'
import { useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()
  
  if (loading) return null
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/" />
  
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Donor Routes */}
        <Route 
          path="/donor" 
          element={
            <ProtectedRoute role="donor">
              <DonorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donor/requests" 
          element={
            <ProtectedRoute role="donor">
              <NearbyRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donor/map" 
          element={
            <ProtectedRoute role="donor">
              <DonorMap />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donor/history" 
          element={
            <ProtectedRoute role="donor">
              <DonorHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donor/profile" 
          element={
            <ProtectedRoute role="donor">
              <DonorProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Hospital Routes */}
        <Route 
          path="/hospital" 
          element={
            <ProtectedRoute role="hospital">
              <HospitalDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hospital/requests" 
          element={
            <ProtectedRoute role="hospital">
              <HospitalRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hospital/requests/new" 
          element={
            <ProtectedRoute role="hospital">
              <PostRequest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hospital/requests/:id" 
          element={
            <ProtectedRoute role="hospital">
              <HospitalRequestDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hospital/donors" 
          element={
            <ProtectedRoute role="hospital">
              <HospitalDonors />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hospital/profile" 
          element={
            <ProtectedRoute role="hospital">
              <HospitalProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/donors" 
          element={
            <ProtectedRoute role="admin">
              <AdminDonors />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/hospitals" 
          element={
            <ProtectedRoute role="admin">
              <AdminHospitals />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/requests" 
          element={
            <ProtectedRoute role="admin">
              <AdminRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <ProtectedRoute role="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute role="admin">
              <AdminSettings />
            </ProtectedRoute>
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
