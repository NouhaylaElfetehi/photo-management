import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    // Écouter les changements dans le localStorage
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-white">
          📸 PhotoManager
        </Link>
        <ul className="flex gap-6 text-white">
          <li><Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link></li>
          <li><Link to="/albums" className="hover:text-blue-300">Albums</Link></li>
          <li><Link to="/profile" className="hover:text-blue-300">Profil</Link></li>

          {isAuthenticated ? (
            <li>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Déconnexion
              </button>
            </li>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-blue-300">Connexion</Link></li>
              <li><Link to="/register" className="hover:text-blue-300">Inscription</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
