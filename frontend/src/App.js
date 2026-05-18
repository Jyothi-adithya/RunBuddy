import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreateRequest from './pages/CreateRequest';
import RequestDetails from './pages/RequestDetails';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import RunHistory from './pages/RunHistory';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-app-surface">
        <Navbar />
        <main className="rb-page-enter">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/create-request" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
            <Route path="/request/:id" element={<ProtectedRoute><RequestDetails /></ProtectedRoute>} />
            <Route path="/chat/:partnerId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><RunHistory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;