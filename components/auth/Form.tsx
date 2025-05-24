"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { isEmptyString } from "@/utils/functions";
import { createNewUser, login } from "@/actions/authAction";
import { signIn } from "next-auth/react";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignin, setIsSignin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmitWithGoogle = async () => {
    try {
      await signIn("google");
    } catch {
      toast.error(
        "Impossible de vous connecter avec Google, veuillez réessayer !"
      );
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    if (
      isEmptyString(email) ||
      isEmptyString(password) ||
      (!isSignin && isEmptyString(name))
    ) {
      toast.error("Veuillez remplir tous les champs requis avant de soumettre");
      setLoading(false);
      return;
    }

    try {
      if (isSignin) {
        const res = await login({
          email: email.trim(),
          password: password.trim(),
        });
        if (res?.error) {
          toast.error(res.message);
          setLoading(false);
          return;
        }
        toast.success("Connexion réussie !");
      } else {
        const res = await createNewUser({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        });
        if (res?.error) {
          toast.error(res.message);
          setLoading(false);
          return;
        }
        toast.success("Inscription réussie ! Bienvenue parmi nous.");
      }
      router.refresh();
      location.reload();
    } catch {
      toast.error("Une erreur s'est produite, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {isSignin ? "Re-Bonjour" : "Bienvenue"} sur{" "}
          <span className="text-primary">SERVI Toons</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs mx-auto">
          {isSignin
            ? "Connectez-vous pour profiter des meilleurs mangas, webtoons et light novels."
            : "Créez un compte pour rejoindre la communauté."}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
        noValidate
      >
        {!isSignin && (
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              Nom
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Jean"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              maxLength={40}
              required={!isSignin}
              autoComplete="given-name"
              autoFocus
              className="dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jean@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            maxLength={40}
            required
            autoComplete="email"
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-gray-700 dark:text-gray-300"
          >
            Mot de passe
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              maxLength={12}
              minLength={6}
              required
              autoComplete={isSignin ? "current-password" : "new-password"}
              className="dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="button"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        {isSignin && (
          <div className="text-right text-sm">
            <Link href="#" className="text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || isEmptyString(email) || isEmptyString(password)}
          className="w-full py-3 text-sm font-semibold rounded-lg shadow-md transition-colors"
        >
          {loading ? "En cours..." : isSignin ? "Se connecter" : "S'inscrire"}
        </Button>
      </form>

      {/* Separator */}
      <div className="flex items-center justify-center gap-3 text-gray-400 dark:text-gray-500">
        <span className="h-px w-10 bg-gray-300 dark:bg-gray-700"></span>
        <span>Ou</span>
        <span className="h-px w-10 bg-gray-300 dark:bg-gray-700"></span>
      </div>

      {/* Social buttons */}
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          disabled={loading}
          onClick={handleSubmitWithGoogle}
          className="flex items-center justify-center 
          gap-3 py-3 text-sm font-semibold rounded-lg"
        >
          <FaGoogle className="h-6 w-6" />
          Continuer avec Google
        </Button>

        <Button
          variant="outline"
          disabled
          className="flex items-center justify-center gap-3 py-3 
          text-sm font-semibold rounded-lg cursor-not-allowed opacity-50"
        >
          <FaFacebook className="h-6 w-6" />
          Continuer avec Facebook
        </Button>
      </div>

      {/* Toggle signin/signup */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        {isSignin
          ? "Vous n'avez pas de compte ?"
          : "Vous avez déjà un compte ?"}{" "}
        <button
          type="button"
          onClick={() => setIsSignin(!isSignin)}
          disabled={loading}
          className="text-primary font-semibold hover:underline"
        >
          {isSignin ? "S'inscrire" : "Se connecter"}
        </button>
      </p>
    </div>
  );
};

export default Form;
