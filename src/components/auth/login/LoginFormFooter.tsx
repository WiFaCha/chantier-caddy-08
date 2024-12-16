import { Button } from "@/components/ui/button";

interface LoginFormFooterProps {
  mode: "login" | "signup" | "reset";
  setMode: (mode: "login" | "signup" | "reset") => void;
}

export function LoginFormFooter({ mode, setMode }: LoginFormFooterProps) {
  return (
    <div className="flex flex-col gap-2 p-0 mt-4">
      {mode === "login" && (
        <>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setMode("signup")}
          >
            Créer un compte
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setMode("reset")}
          >
            Mot de passe oublié ?
          </Button>
        </>
      )}
      {(mode === "signup" || mode === "reset") && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setMode("login")}
        >
          Retour à la connexion
        </Button>
      )}
    </div>
  );
}