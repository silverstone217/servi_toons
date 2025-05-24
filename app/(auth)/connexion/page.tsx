import { getUser } from "@/actions/authAction";
import Form from "@/components/auth/Form";
import SignInImages from "@/components/auth/SignInImages";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Form container */}
      <section className="flex flex-1 flex-col justify-center items-center px-6 py-12 md:py-24 md:px-16 max-w-lg mx-auto md:max-w-none md:mx-0">
        <Form />
        <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-500 select-none">
          © 2025 SERVI Toons. Tous droits réservés.
        </footer>
      </section>

      {/* Images container - visible uniquement sur md+ */}
      <section className="hidden md:flex flex-1 relative overflow-hidden">
        <SignInImages />
        {/* Overlay doux pour fondu */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
      </section>
    </main>
  );
};

export default SignInPage;
