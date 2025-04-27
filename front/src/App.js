import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from './components/Home';
import Deck from './components/Deck';
import Tarocchi from './components/Tarocchi';
import Login from './components/Login';
import Register from './components/Register';
import Profilo from './components/Profilo';
import ModificaProfilo from './components/ModificaProfilo';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard'; // ✅ Aggiunto

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="app-wrapper">
        <Router>
          <NavigationBar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="/lettura"
                element={
                  <ProtectedRoute>
                    <Deck />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profilo"
                element={
                  <ProtectedRoute>
                    <Profilo />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profilo/modifica"
                element={
                  <ProtectedRoute>
                    <ModificaProfilo />
                  </ProtectedRoute>
                }
              />

              <Route path="/carte" element={<Tarocchi />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ✅ Login admin */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* ✅ Dashboard admin */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;


