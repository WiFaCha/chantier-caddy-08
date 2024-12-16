import { CardDescription, CardTitle } from "@/components/ui/card";

interface LoginFormHeaderProps {
  mode: "login" | "signup" | "reset";
}

export function LoginFormHeader({ mode }: LoginFormHeaderProps) {
  return (
    <div className="p-0 mb-4">
      <CardTitle>
        {mode === "login"
          ? "Connexion"
          : mode === "signup"
          ? "Créer un compte"
          : "Réinitialiser le mot de passe"}
      </CardTitle>
      <CardDescription>
        {mode === "login"
          ? "Connectez-vous pour accéder à votre espace"
          : mode === "signup"
          ? "Créez votre compte pour commencer"
          : "Entrez votre email pour réinitialiser votre mot de passe"}
      </CardDescription>
    </div>
  );
}