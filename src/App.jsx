import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import DataUpload from './pages/DataUpload'
import DataViewer from './pages/DataViewer'

/**
 * Main App Component
 * 
 * This component sets up the routing structure for the application.
 * It includes routes for authentication, data upload, and data viewing.
 * 
 * Routes:
 * - /login: User login page
 * - /signup: User registration page
 * - /dashboard: Main dashboard after login
 * - /upload: Data upload interface
 * - /view: Data viewing and filtering interface
 */
function App() {
  return (
    <Routes>
      {/* Public routes - no authentication required */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected routes - wrapped in Layout component */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<DataUpload />} />
        <Route path="view" element={<DataViewer />} />
      </Route>
    </Routes>
  )
}

export default App
