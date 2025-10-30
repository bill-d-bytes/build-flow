import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Menu, User, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { Link } from "react-router-dom";

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Builder Stop
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/materials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Materials
            </Link>
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/materials">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-accent text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                      0
                    </span>
                  </Button>
                </Link>

                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <div className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={handleAuthClick}>
                  Sign In
                </Button>
                <Button
                  onClick={handleAuthClick}
                  className="bg-primary hover:bg-primary-glow text-primary-foreground"
                >
                  Get Started
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};
