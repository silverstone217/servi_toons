import AddContentForm from "@/components/dashboard/contents/AddContentForm";
import React from "react";

function AddContentPage() {
  return (
    <div className="flex flex-col gap-10 ">
      <div className="max-w-lg space-y-2">
        <h2 className="text-2xl font-medium">Ajouter un nouveau contenu</h2>
        <p className="text-sm text-pretty opacity-90">
          Specifier votre contenu en fournissant des informations et les champs
          avec un <strong>*</strong> son obligatoires.
        </p>
      </div>

      {/* form */}

      <AddContentForm />
    </div>
  );
}

export default AddContentPage;
