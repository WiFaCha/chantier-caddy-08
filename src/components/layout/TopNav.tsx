import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar } from "lucide-react";

export function TopNav() {
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
                  `flex items-center rounded-lg p-2 transition-all hover:bg-primary-light hover:text-white ${
                    isActive ? "bg-primary text-white" : "text-gray-500"
                  }`
                }
                title="Accueil"
              >
                <LayoutDashboard className="h-5 w-5" />
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `flex items-center rounded-lg p-2 transition-all hover:bg-primary-light hover:text-white ${
                    isActive ? "bg-primary text-white" : "text-gray-500"
                  }`
                }
                title="Chantiers"
              >
                <Calendar className="h-5 w-5" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}