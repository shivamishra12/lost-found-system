import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} 
        />
      </Routes>
    </>
  );
};

export default App;
