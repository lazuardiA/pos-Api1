import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const memberLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/classes", label: "Kelas" },
    { to: "/my-bookings", label: "Booking Saya" },
    { to: "/profile", label: "Profil" },
  ];

  const adminLinks = [
    { to: "/admin/classes", label: "Kelola Kelas" },
    { to: "/admin/members", label: "Kelola Member" },
    { to: "/admin/bookings", label: "Semua Booking" },
  ];

  const links = user ? (user.role === "admin" ? [...memberLinks.slice(0, 1), ...adminLinks, { to: "/profile", label: "Profil" }] : memberLinks) : [];

  return (
    <nav className="bg-surface border-b border-line sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pulse opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pulse"></span>
            </span>
            <span className="font-display text-xl tracking-wide">
              PULSE<span className="text-pulse">FIT</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-mist hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary !py-2">
                Logout
              </button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary !py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !py-2">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Buka menu navigasi"
          >
            {open ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-line bg-surface px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-mist hover:text-white border-b border-line/50"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary mt-3 w-full">
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
