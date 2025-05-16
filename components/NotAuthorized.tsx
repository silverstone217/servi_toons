import Link from "next/link";
import { Button } from "./ui/button";

const NotPermitted = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-[70dvh] gap-4 px-4 lg:flex-1 
    text-balance text-center"
    >
      <h1 className="text-2xl font-bold">Accès refusé</h1>
      <p className="text-gray-500">
        Vous n&apos;avez pas les permissions pour accéder à cette page
      </p>
      <Link href="/">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
};

const LogInToContinue = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70dvh] gap-4 p-4 text-balance text-center">
      <h1 className="text-2xl font-bold">Accès refusé</h1>
      <p className="text-gray-500">
        Connectez-vous pour continuer à accéder à cette page
      </p>
      <Link href="/connexion">
        <Button>Se connecter</Button>
      </Link>
    </div>
  );
};

export { NotPermitted, LogInToContinue };
