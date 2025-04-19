
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  PieChart,
  History,
  LogOut,
  Upload,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user && !location.pathname.includes("/login") && !location.pathname.includes("/signup")) {
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  // Redirect to dashboard if authenticated and on login/signup page
  React.useEffect(() => {
    if (user && (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/")) {
      navigate("/dashboard");
    }
  }, [user, navigate, location.pathname]);

  if (!user) {
    // For login and signup pages, only render children without the sidebar
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Submit Report",
      path: "/report-submission",
      icon: <Upload size={20} />,
    },
    {
      name: "Analysis",
      path: "/report-analysis",
      icon: <PieChart size={20} />,
    },
    {
      name: "Report History",
      path: "/report-history",
      icon: <History size={20} />,
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen border-r border-border bg-card fixed transition-all duration-300 z-20",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 h-16">
          {!collapsed && (
            <div className="font-semibold text-xl text-gradient">CrediSphere</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "sidebar-item",
                    isActive
                      ? "sidebar-item-active"
                      : "text-foreground/70 hover:bg-accent",
                    collapsed && "justify-center"
                  )
                }
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-foreground/70 hover:text-foreground",
              collapsed && "justify-center"
            )}
            onClick={logout}
          >
            <LogOut size={18} />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="mr-2"
          >
            <Menu size={24} />
          </Button>
          <div className="font-semibold text-xl text-gradient">CrediSphere</div>
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleMobileMenu}
          />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-card shadow-lg animate-slide-in-right">
            <div className="flex items-center justify-between p-4 h-16 border-b border-border">
              <div className="font-semibold text-xl text-gradient">CrediSphere</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="rounded-full"
              >
                <X size={18} />
              </Button>
            </div>
            <div className="overflow-y-auto py-4 px-3">
              <div className="mb-4 p-3 rounded-lg glass-card">
                <p className="text-sm text-foreground/70">Signed in as</p>
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs font-medium text-primary truncate">
                  {user?.organization}
                </p>
              </div>
              <Separator className="my-2" />
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "sidebar-item",
                        isActive
                          ? "sidebar-item-active"
                          : "text-foreground/70 hover:bg-accent"
                      )
                    }
                    onClick={toggleMobileMenu}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <Separator className="my-4" />
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground/70 hover:text-foreground"
                onClick={() => {
                  toggleMobileMenu();
                  logout();
                }}
              >
                <LogOut size={18} />
                <span className="ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "lg:ml-20" : "lg:ml-64",
          "lg:pt-0 pt-16"
        )}
      >
        <div className="hidden lg:flex items-center justify-end p-4 h-16 border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-foreground/70">
              <span className="hidden md:inline-block">{user?.email}</span>
              {" • "}
              <span className="text-primary">{user?.organization}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
        <div className="animate-fade-in p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
