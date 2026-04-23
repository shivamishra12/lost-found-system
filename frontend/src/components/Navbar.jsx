import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, PackageSearch } from 'lucide-react';
import { logoutUser } from '../services/api';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <PackageSearch size={28} />
          Lost & Found
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <span style={{ fontWeight: 500 }}>Hello, {user.name}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
