"use client";
import { Button } from "@/components/ui/button";
import { CategoriesData } from "@/utils/data";
import { returnDataValue } from "@/utils/functions";
import { Content } from "@prisma/client";
import React from "react";

interface Props {
  content: Content;
}

const DangerZone = ({ content }: Props) => {
  return (
    <div className="bg-destructive border rounded-xl shadow-sm p-6 space-y-5">
      <h2 className="text-xl font-semibold mb-2">Zone de danger</h2>

      <div className="">
        <Button variant={"destructive"} className="shadow-lg">
          Supprimer mon{" "}
          {returnDataValue({ value: content.category, data: CategoriesData })}
        </Button>
      </div>
    </div>
  );
};

export default DangerZone;
