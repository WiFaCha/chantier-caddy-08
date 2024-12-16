import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { LoginFormHeader } from "./login/LoginFormHeader";
import { LoginFormFields } from "./login/LoginFormFields";
import { LoginFormFooter } from "./login/LoginFormFooter";
import { useLoginForm } from "./login/useLoginForm";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    mode,
    setMode,
    loading,
    handleSubmit,
  } = useLoginForm(onSuccess);

  return (
    <div className="p-4">
      <LoginFormHeader mode={mode} />
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <LoginFormFields
            mode={mode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Chargement..." : mode === "login"
              ? "Se connecter"
              : mode === "signup"
              ? "Créer le compte"
              : "Envoyer le lien"}
          </Button>
        </form>
      </CardContent>
      <LoginFormFooter mode={mode} setMode={setMode} />
    </div>
  );
}