import { Button } from "@/components/ui/button";
import { Calendar, Home, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const links = [
    { icon: Home, label: "Accueil", to: "/" },
    { icon: Calendar, label: "Chantiers", to: "/projects" },
    { icon: Settings, label: "Paramètres", to: "/settings" },
  ];

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary-light hover:text-white ${
                    isActive ? "bg-primary text-white" : "text-gray-500"
                  }`
                }
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}