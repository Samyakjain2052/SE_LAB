import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GroupBuyProvider } from './context/GroupBuyContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MyGroupsPage from './pages/MyGroupsPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import JoinGroupPage from './pages/JoinGroupPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <GroupBuyProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/join/:token" element={<JoinGroupPage />} />
            <Route
              path="/my-groups"
              element={
                <ProtectedRoute>
                  <MyGroupsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group/:id"
              element={
                <ProtectedRoute>
                  <GroupDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </GroupBuyProvider>
    </AuthProvider>
  );
}

export default App;