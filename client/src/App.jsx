import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportCrime from './pages/ReportCrime';
import Login from './pages/Login';
import Support from './pages/Support';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Resources from './pages/Resources';
import LockdownAlert from './components/LockdownAlert';

function App() {
  return (
    <Router>
      <LockdownAlert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report-crime" element={<ReportCrime />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}

export default App;
