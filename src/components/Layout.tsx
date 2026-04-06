import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  PenSquare,
  TrendingUp,
  BookOpen,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Crown,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import "./Layout.css";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      alert("Tap Share → Add to Home Screen");
      return;
    }

    if (!installPrompt) {
      alert("Install not available yet");
      return;
    }

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installed = window.matchMedia("(display-mode: standalone)").matches;
    setIsInstalled(installed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  /* ===============================
     👤 Load user from localStorage
  ================================ */
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    // ❌ Not logged in → go to login
    if (!storedUser) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const isPricingPage = location.pathname.includes("pricing");
    const istermsPage = location.pathname.includes("terms");

    // 🚨 Onboarding not completed → force Profile page
    // BUT skip this check if user is on pricing page
    if (parsedUser.onboardingCompleted === false && !isPricingPage && !istermsPage) {
      navigate("/onboarding");
    }
  }, [navigate]);

  /* ===============================
     🚪 Logout
  ================================ */
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/log", icon: PenSquare, label: "Log" },
    { path: "/track", icon: TrendingUp, label: "Track" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/pricing", icon: Crown, label: "Pricing" },
    { path: "/help", icon: HelpCircle, label: "Help & Support" },
    { path: "/terms", icon: HelpCircle, label: "Terms & Privacy" },
  ];

  const bottomNavItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/log", icon: PenSquare, label: "Log" },
    { path: "/track", icon: TrendingUp, label: "Track" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="layout">
      {/* 📱 Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🧭 Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src="/icon.png" alt="VitalState" className="sidebar-logo" />
          <span className="sidebar-title">VitalState</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
         <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        {/* 👤 User Info */}
        <div className="sidebar-footer">
          {user && (
            <div className="user-info">
              <div className="user-avatar">{user.name?.charAt(0) || "U"}</div>
              <div className="user-details">
                <span className="user-name">{user.name || "User"}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
          )}
          {!isInstalled && (
            <button className="install-btn" onClick={handleInstallClick}>
              <Download size={18} />
              <span>Install App</span>
            </button>
          )}

        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 📄 Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* 📱 Bottom Navigation */}
      <nav className="bottom-nav">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        {/* Install button for mobile */}
        {!isInstalled && (
          <button className="bottom-install-btn" onClick={handleInstallClick}>
            <Download size={22} />
            <span>Install</span>
          </button>
        )}
        <button className="bottom-logout-btn" onClick={handleLogout}>
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
