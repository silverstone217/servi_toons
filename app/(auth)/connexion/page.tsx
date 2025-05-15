import { getUser } from "@/actions/authAction";
import Form from "@/components/auth/Form";
import SignInImages from "@/components/auth/SignInImages";
import { redirect } from "next/navigation";
import React from "react";

const SignInPage = async () => {
  const user = await getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <div
      className="md:grid flex flex-col w-full h-dvh lg:overflow-hidden 
     px-6 lg:px-10 py-4 md:py-6 gap-12
    grid-cols-2 
    "
    >
      {/* form */}
      <div className="w-full md:h-full md:flex hidden flex-col">
        <Form />
        <div
          className="flex w-full text-xs text-center gap-2 py-4 
       text-gray-500 mt-auto  max-w-md mx-auto items-center justify-center"
        >
          © 2025 SERVI Toons. Tous droits réservés.
        </div>
      </div>
      {/* image */}
      <div className="w-full md:h-full ">
        <SignInImages />
      </div>

      {/* form small screen */}
      <div className="w-full flex-1 md:hidden flex flex-col gap-6">
        <Form />

        <div
          className="flex w-full text-xs text-center gap-2 pb-4 
       text-gray-500 mt-auto max-w-md mx-auto items-center justify-center"
        >
          © 2025 SERVI Toons. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
