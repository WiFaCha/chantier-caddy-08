import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function TopNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-primary">Willy Services</h2>
            <div className="flex items-center space-x-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary-light hover:text-white ${
                    isActive ? "bg-primary text-white" : "text-gray-500"
                  }`
                }
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Accueil
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary-light hover:text-white ${
                    isActive ? "bg-primary text-white" : "text-gray-500"
                  }`
                }
              >
                <Calendar className="mr-2 h-4 w-4" />
                Chantiers
              </NavLink>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-primary"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </nav>
  );
}