"use server";
import { addContentSchema } from "@/schema/contentSchema";
import { z } from "zod";
import { getUser } from "./authAction";
import { generateSlug } from "@/utils/functions";
import { prisma } from "@/lib/prisma";

// ADD NEW CONTENT
export type newContentType = z.infer<typeof addContentSchema>;

export const addContent = async (newContent: newContentType) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour ajouter un contenu.",
      contentId: "",
    };
  }

  const validationResult = addContentSchema.safeParse(newContent);

  if (!validationResult.success) {
    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      contentId: "",
      errors: validationResult.error.issues,
    };
  }

  const validated = validationResult.data;
  const baseTitle = validated.title.toLowerCase().trim();

  // Génération du slug unique
  let slug = generateSlug(baseTitle);
  let isThisSlugExistAlready = await prisma.content.findUnique({
    where: { slug },
  });

  let attempts = 0;
  const maxAttempts = 10;
  while (isThisSlugExistAlready && attempts < maxAttempts) {
    slug = generateSlug(baseTitle);
    isThisSlugExistAlready = await prisma.content.findUnique({
      where: { slug },
    });
    attempts++;
  }
  if (isThisSlugExistAlready) {
    return {
      error: true,
      message:
        "Impossible de générer un slug unique après plusieurs tentatives.",
      contentId: "",
    };
  }

  // Préparation des données optionnelles
  const optionalFields = {
    ...(validated.artist ? { artist: validated.artist } : {}),
    ...(validated.author ? { author: validated.author } : {}),
    ...(validated.edition ? { edition: validated.edition } : {}),
  };

  // Vérifier le type de publishedAt (Date ou string)
  const publishedAt =
    validated.publishedAt instanceof Date
      ? validated.publishedAt
      : new Date(validated.publishedAt);

  // Ici on suppose que validated.image est une URL string
  const image = validated.image;

  const addContent = await prisma.content.create({
    data: {
      title: baseTitle,
      slug,
      description: validated.description.trim(),
      tags: validated.tags,
      category: validated.category,
      target: validated.target,
      userId: user.id,
      language: validated.language,
      isColored: validated.isColored,
      publishedAt,
      status: validated.status,
      image,
      ...optionalFields,
    },
  });

  if (!addContent) {
    return {
      error: true,
      message: "Une erreur est survenue lors de l'ajout du contenu.",
      contentId: "",
    };
  }

  return {
    error: false,
    message: "Contenu ajouté avec succès!",
    contentId: addContent.id,
  };
};

// GET MY CONTENTS
export const getMyContents = async () => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour continuer.",
      data: [],
    };
  }

  const contents = await prisma.content.findMany({
    where: { userId: user.id },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!contents || contents.length < 1) {
    return {
      error: true,
      message: "Vous n'avez pas encore du contenu!",
      data: [],
    };
  }
  return {
    error: false,
    message: "Contenus trouvés",
    data: contents.filter((con) => con.userId === user.id),
  };
};

// GET MY CONTENT BY ID
export const getMyContentByID = async (id: string) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour continuer.",
      data: null,
    };
  }

  const content = await prisma.content.findUnique({
    where: { userId: user.id, id },
  });

  if (!content) {
    return {
      error: true,
      message: "Ce comptenu n'existe pas ou a été supprimé!",
      data: null,
    };
  }
  return {
    error: false,
    message: "Contenu trouvé",
    data: content,
  };
};
