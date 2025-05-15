"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
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
    } catch (error) {
      console.log(error);
      toast.error(
        "Impossible de vous connceter avec google, veuillez reéssayer!"
      );
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEmptyString(email) || isEmptyString(password)) {
        toast.error("Veuillez remplir tous les champs avant de soumettre");
        return;
      }

      //   login process
      const formData = { email: email.trim(), password: password.trim() };
      if (isSignin) {
        const signUser = await login(formData);
        if (signUser?.error) {
          toast.error(signUser.message);
          return;
        }
        toast.success("Connexion réussie!");
        router.refresh();
        location.reload();
        return;
      }

      //   signup process
      if (isEmptyString(name)) {
        toast.error("Veuillez renseigner votre nom avant de soumettre");
        return;
      }

      const formDataSign = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      };
      const createUser = await createNewUser(formDataSign);
      if (createUser?.error) {
        toast.error(createUser.message);
        return;
      }
      toast.success("Inscription réussie! Bienvenue parmi nous!.");
      router.refresh();
      location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Une erreur s'est produite, veuillez réessayer.");
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  return (
    <div
      className="w-full md:flex-1 md:overflow-hidden flex flex-col gap-6 md:gap-16 max-w-md mx-auto
     justify-center 
    "
    >
      {/* Text top welcome */}
      <div className="space-y-2 lg:space-y-3">
        <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-balance max-w-md">
          {isSignin ? "Re-Bonjour" : "Bienvenue"} sur <span>SERVI</span>{" "}
          <span className="text-primary">Toons</span>
        </h2>
        <p className="text-sm max-w-md">
          Connectez-vous et profiter des meilleurs mangas, webtoons et light
          novels de la plateforme.
        </p>
      </div>

      {/* Form */}
      <form className="md:space-y-6 space-y-4 w-full ">
        {/* name */}
        {!isSignin && (
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isSignin ? false : true}
              className="w-full text-sm font-medium"
              autoComplete="given-name"
              autoFocus
              disabled={isSignin}
              placeholder="Jean "
              maxLength={40}
            />
          </div>
        )}

        {/* email */}
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-sm font-medium"
            autoComplete="email"
            placeholder="jean@exemple.com"
            maxLength={40}
          />
        </div>

        {/* password */}
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-sm font-medium"
              autoComplete="current-password"
              placeholder="********"
              maxLength={12}
              min={6}
            />
            <button
              type="button"
              className="absolute right-0 top-0 p-2 text-sm font-medium text-gray-600 
              transition-all duration-300 ease-in-out focus:outline-none cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* forget password */}
        {isSignin && (
          <div className="text-sm flex w-full items-center justify-end">
            <Link
              href="#"
              className="text-xs text-gray-600 hover:opacity-70
              transition-all duration-300 ease-in-out"
            >
              Mot de passe oublié?
            </Link>
          </div>
        )}
        {/* submit */}
        <Button
          className="w-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={loading || isEmptyString(email) || isEmptyString(password)}
        >
          {loading ? "En cours..." : isSignin ? "Se connecter" : "S'inscrire"}
        </Button>

        {/* or */}
        <div className="flex w-full items-center justify-center">
          <span className="text-sm">Ou</span>
        </div>
        {/* social media */}
        <div className="flex flex-col w-full items-center gap-4 md:gap-6">
          {/* Google */}
          <Button
            variant={"secondary"}
            type="button"
            className="w-full flex items-center gap-3 cursor-pointer"
            disabled={loading}
            onClick={handleSubmitWithGoogle}
          >
            <FaGoogle className="h-5 w-5 " />
            <span>Continuer avec Google</span>
          </Button>

          {/* Facebook */}
          <Button
            variant={"secondary"}
            type="button"
            className="w-full flex items-center gap-3 cursor-pointer"
            disabled
          >
            <FaFacebook className="h-5 w-5 " />
            <span>Continuer avec Facebook</span>
          </Button>
        </div>
        {/* signin or signup */}
        <div className="flex w-full items-center gap-2 justify-center  lg:pb-0 mt-4 text-sm">
          <span>
            {isSignin
              ? "Vous n'avez pas de compte?"
              : "Vous avez deja un compte"}
          </span>
          <button
            type="button"
            onClick={() => setIsSignin(!isSignin)}
            className=" text-gray-400 hover:text-gray-700 cursor-pointer
            transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            {isSignin ? "S'inscrire" : "Se connecter"}
          </button>
        </div>
      </form>

      {/* ALl right reserved */}
    </div>
  );
};

export default Form;
