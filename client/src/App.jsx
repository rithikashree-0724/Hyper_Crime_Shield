import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportCrime from './pages/ReportCrime';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import InvestigatorDashboard from './pages/InvestigatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportDetails from './pages/ReportDetails';
import Alerts from './pages/Alerts';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Resources from './pages/Resources';
import Verify from './pages/Verify';
import About from './pages/About';
import Team from './pages/Team';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/investigator-dashboard" element={<InvestigatorDashboard />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute requireVerification={true} />}>
            <Route path="/report-crime" element={<ReportCrime />} />
          </Route>
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
