import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginForm } from "../auth/LoginForm";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/utils/supabaseUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";

export function TopNav() {
  const { toast } = useToast();
  const { data: user, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      return;
    }
    await refetch();
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    });
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
                {user && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
              {user ? (
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Connecté avec : {user.email}
                  </p>
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    Se déconnecter
                  </Button>
                </div>
              ) : (
                <LoginForm onSuccess={refetch} />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}