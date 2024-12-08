import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="ml-4 flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-primary">Willy Services</h2>
        </div>
      </div>
    </nav>
  );
}