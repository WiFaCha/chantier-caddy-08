import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm(onSuccess?: () => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [loading, setLoading] = useState(false);
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
          toast({
            title: "Erreur de connexion",
            description: error.message === "Invalid login credentials" 
              ? "Email ou mot de passe incorrect"
              : error.message,
            variant: "destructive",
          });
          return;
        }
        
        onSuccess?.();
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

  return {
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
  };
}