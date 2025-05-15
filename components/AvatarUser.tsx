"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const AvatarUser = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const shortName = user.name ? user.name.slice(0, 2).toUpperCase() : "NN";
  return (
    <Avatar>
      <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
      <AvatarFallback>{shortName}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarUser;
