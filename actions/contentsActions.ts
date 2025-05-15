"use server";
import {
  addContentSchema,
  addContentSecondSchema,
  modifyContentFPSchema,
  modifyContentSISchema,
} from "@/schema/contentSchema";
import { z } from "zod";
import { getUser } from "./authAction";
import { createSlug } from "@/utils/functions";
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
    // Retourner les erreurs Zod formatées

    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      contentId: "",
      errors: validationResult.error.issues, // Important: Retourner les erreurs Zod
    };
  }

  const validated = validationResult.data; // Utiliser les données validées

  const slug = createSlug(validated.title.toLowerCase().trim());

  const addContent = await prisma.content.create({
    data: {
      title: validated.title.toLowerCase().trim(),
      slug: slug,
      description: validated.description,
      tags: validated.tags,
      category: validated.category,
      target: validated.target,
      authorId: user.id,
      language: validated.language,
      isColored: validated.isColored,
      publishedAt: validated.publishedAt,
      status: validated.status,
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

// add images
export type newContentSecondType = z.infer<typeof addContentSecondSchema>;

export const addContentImages = async (
  newContentSecond: newContentSecondType
) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message:
        "Veuillez vous connecter pour ajouter des images à votre contenu.",
    };
  }
  const validationResult = addContentSecondSchema.safeParse(newContentSecond);
  if (!validationResult.success) {
    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
    };
  }

  const validated = validationResult.data; // Utiliser les données validées
  const { contentId, image, cover } = validated;

  const isContentExist = await prisma.content.findUnique({
    where: { id: contentId },
  });
  if (!isContentExist) {
    return {
      error: true,
      message: "Contenu non trouvé!",
    };
  }

  if (isContentExist.authorId !== user.id) {
    return {
      error: true,
      message: "Vous n'êtes pas l'auteur de ce contenu!",
    };
  }
  const updateContent = await prisma.content.update({
    where: { id: contentId },
    data: {
      image: image,
      cover: cover !== "" ? cover : null,
    },
  });

  if (!updateContent) {
    return {
      error: true,
      message: "Une erreur est survenue lors de l'ajout des images.",
      imgUrl: image,
      coverUrl: cover,
    };
  }
  return {
    error: false,
    message: "Votre contenu ajouté avec succès!",
    imgUrl: image,
    coverUrl: cover,
  };
};

//MODIFY CONTENT
export type modifyContentFirstPartType = z.infer<typeof modifyContentFPSchema>;

export const modifyContentFirstPart = async (
  content: modifyContentFirstPartType
) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour modifier un contenu.",
    };
  }

  const validationResult = modifyContentFPSchema.safeParse(content);

  if (!validationResult.success) {
    // Retourner les erreurs Zod formatées

    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      errors: validationResult.error.issues, // Important: Retourner les erreurs Zod
    };
  }

  const validated = validationResult.data; // Utiliser les données validées
  const slug = createSlug(validated.title.toLowerCase().trim());

  const isContentExisted = await prisma.content.findUnique({
    where: { id: validated.contentId },
  });

  if (!isContentExisted) {
    return {
      error: true,
      message: "Ce contenu n'existe pas ou n'est plus disponible!",
    };
  }
  if (isContentExisted.authorId !== user.id) {
    return {
      error: true,
      message: "Ce contenu ne vous appartient pas!",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { contentId: _ID, ...rest } = validated;

  const updateContent = await prisma.content.update({
    where: { id: validated.contentId },
    data: {
      ...rest,
      slug,
    },
  });

  if (!updateContent) {
    return {
      error: true,
      message: "Impossible d'effectuer cette action!",
    };
  }
  return {
    error: false,
    message: "Contenu modifié avec succès",
  };
};

export type modifyContentSecondPartType = z.infer<typeof modifyContentSISchema>;

export const modifyContentSecondPart = async (
  content: modifyContentSecondPartType
) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour modifier un contenu.",
    };
  }

  const validationResult = modifyContentSISchema.safeParse(content);

  if (!validationResult.success) {
    // Retourner les erreurs Zod formatées

    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      errors: validationResult.error.issues, // Important: Retourner les erreurs Zod
    };
  }

  const validated = validationResult.data; // Utiliser les données validées

  const isContentExisted = await prisma.content.findUnique({
    where: { id: validated.contentId },
  });

  if (!isContentExisted) {
    return {
      error: true,
      message: "Ce contenu n'existe pas ou n'est plus disponible!",
    };
  }
  if (isContentExisted.authorId !== user.id) {
    return {
      error: true,
      message: "Ce contenu ne vous appartient pas!",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { contentId: _ID, ...rest } = validated;

  const updateContent = await prisma.content.update({
    where: { id: validated.contentId },
    data: {
      ...rest,
    },
  });

  if (!updateContent) {
    return {
      error: true,
      message: "Impossible d'effectuer cette action!",
    };
  }
  return {
    error: false,
    message: "Contenu modifié avec succès",
  };
};

export const updateCoverServer = async ({
  cover,
  contentId,
}: {
  cover: string;
  contentId: string;
}) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour modifier un contenu.",
    };
  }

  const isContentExisted = await prisma.content.findUnique({
    where: { id: contentId },
  });

  if (!isContentExisted) {
    return {
      error: true,
      message: "Ce contenu n'existe pas ou n'est plus disponible!",
    };
  }
  if (isContentExisted.authorId !== user.id) {
    return {
      error: true,
      message: "Ce contenu ne vous appartient pas!",
    };
  }
  const updateContent = await prisma.content.update({
    where: { id: contentId },
    data: { cover: cover ?? undefined },
  });

  if (!updateContent) {
    return {
      error: true,
      message: "Impossible de modifier ou d'ajouter votre image de couverture",
    };
  }

  return {
    error: false,
    message: "Modifiée avec succès!",
  };
};

// DELETE CMY CONTENT
export const deleteMyContent = async (contentId: string) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour supprimer un contenu.",
    };
  }
  const isContentExisted = await prisma.content.findUnique({
    where: { id: contentId },
  });

  if (!isContentExisted) {
    return {
      error: true,
      message: "Ce contenu n'existe pas ou n'est plus disponible!",
    };
  }
  if (isContentExisted.authorId !== user.id) {
    return {
      error: true,
      message: "Ce contenu ne vous appartient pas!",
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _deleteContent = await prisma.content.delete({
      where: { id: contentId },
    });
    return {
      error: false,
      message: "Le contenu a été supprimé!",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du contenu:", error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la suppression du contenu.",
    };
  }
};

// Get MY CONTENT
export const getMyContent = async () => {
  const user = await getUser();
  if (!user) return [];
  const myContent = await prisma.content.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });
  return myContent ?? [];
};

// GET ALL CONTENTS
export const getContents = async () => {
  const myContent = await prisma.content.findMany({
    orderBy: { createdAt: "desc" },
  });
  return myContent ?? [];
};

// GET CONTENT BY ID
export const getContentByID = async (id: string) => {
  const content = await prisma.content.findUnique({
    where: {
      id,
    },
  });

  return content ?? null;
};
