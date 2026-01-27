import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportCrime from './pages/ReportCrime';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import InvestigatorDashboard from './pages/InvestigatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportDetails from './pages/ReportDetails';
import Support from './pages/Support';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Resources from './pages/Resources';
import LockdownAlert from './components/LockdownAlert';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <LockdownAlert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/investigator-dashboard" element={<InvestigatorDashboard />} />
        <Route element={<ProtectedRoute requireVerification={true} />}>
          <Route path="/report-crime" element={<ReportCrime />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}

export default App;
