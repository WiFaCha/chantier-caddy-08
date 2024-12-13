import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup" | "reset";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message === "Invalid login credentials") {
            toast({
              title: "Erreur de connexion",
              description: "Email ou mot de passe incorrect",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }
        
        navigate("/");
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          toast({
            title: "Erreur",
            description: "Les mots de passe ne correspondent pas",
            variant: "destructive",
          });
          return;
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Compte créé",
          description: "Votre compte a été créé avec succès",
        });
        setMode("login");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Email envoyé",
          description: "Un email de réinitialisation vous a été envoyé",
        });
        setMode("login");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Chargement..." : mode === "login"
              ? "Se connecter"
              : mode === "signup"
              ? "Créer le compte"
              : "Envoyer le lien"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
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
      </CardFooter>
    </Card>
  );
}