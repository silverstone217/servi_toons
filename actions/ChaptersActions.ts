"use server";
import { z } from "zod";
import { getUser } from "./authAction";
import { prisma } from "@/lib/prisma";
import { modChapterSchema, newChapterSchema } from "@/schema/chaptersSchema";

// ADD NEW CHAPTER
export type addNewChapType = z.infer<typeof newChapterSchema>;
export const addNewChap = async (data: addNewChapType) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour ajouter un contenu.",
    };
  }

  const validationResult = newChapterSchema.safeParse(data);

  if (!validationResult.success) {
    // Retourner les erreurs Zod formatées

    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      errors: validationResult.error.issues, // Important: Retourner les erreurs Zod
    };
  }

  const validated = validationResult.data;

  //   Check if exist?
  const IsContentExisted = await prisma.content.findUnique({
    where: { id: validated.contentId },
  });

  if (!IsContentExisted) {
    return {
      error: true,
      message: "Ce contenu n'existe plus ou a été supprimé!",
    };
  }

  //   Check if user is the Author?
  const isAuthor = IsContentExisted.authorId === user.id;

  if (!isAuthor) {
    return {
      error: true,
      message: "Vous n'êtes pas l'auteur de ce contenu!",
    };
  }

  //   Check if the chap with this order exist already
  const isChapsExisted = await prisma.chapter.findMany({
    where: { contentId: validated.contentId },
  });
  const isChapExisted = isChapsExisted.find(
    (chap) => chap.order === validated.order
  );

  if (isChapExisted) {
    return {
      error: true,
      message: "Ce chapitre de cet ordre(numéro) existe deja!",
    };
  }

  //   ADD now
  const newChap = await prisma.chapter.create({ data: { ...validated } });

  if (!newChap) {
    return {
      error: true,
      message: "Impossible d'effectuer cette action, réessayez plus tard!",
    };
  }

  return {
    error: false,
    message: "Chapitre ajouté avec succès!",
  };
};

// MODIFY CHAP
export type ModChapType = z.infer<typeof modChapterSchema>;
export const modifyChap = async (data: ModChapType) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour ajouter un contenu.",
    };
  }

  const validationResult = modChapterSchema.safeParse(data);

  if (!validationResult.success) {
    // Retourner les erreurs Zod formatées

    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      errors: validationResult.error.issues, // Important: Retourner les erreurs Zod
    };
  }

  const validated = validationResult.data;

  //   Check if exist?
  const IsContentExisted = await prisma.content.findUnique({
    where: { id: validated.contentId },
  });

  if (!IsContentExisted) {
    return {
      error: true,
      message: "Ce contenu n'existe plus ou a été supprimé!",
    };
  }

  //   Check if user is the Author?
  const isAuthor = IsContentExisted.authorId === user.id;

  if (!isAuthor) {
    return {
      error: true,
      message: "Vous n'êtes pas l'auteur de ce contenu!",
    };
  }

  const checkIfChapNotExist = await prisma.chapter.findUnique({
    where: { id: validated.chapterId },
  });

  if (!checkIfChapNotExist) {
    return {
      error: true,
      message: "Ce chapitre n'existe pas ou une erreur est survenue!",
    };
  }

  //   Check if the chap with this order exist already
  const isChapExisted = await prisma.chapter.findFirst({
    where: {
      contentId: validated.contentId,
      order: validated.order,
      NOT: { id: validated.chapterId }, // Exclut le chapitre actuellement modifié
    },
  });

  if (isChapExisted) {
    return {
      error: true,
      message: "Ce chapitre de cet ordre(numéro) existe déjà!",
    };
  }

  //   Modify now
  const modChap = await prisma.chapter.update({
    where: { id: validated.chapterId },
    data: { title: validated.title, order: validated.order },
  });

  if (!modChap) {
    return {
      error: true,
      message: "Impossible d'effectuer cette action, réessayez plus tard!",
    };
  }

  return {
    error: false,
    message: "Chapitre modifié avec succès!",
  };
};

// GET CHAPS
export const getChapsByContentId = async (contentId: string) => {
  const chaps = await prisma.chapter.findMany({
    where: { contentId },
    orderBy: {
      order: "asc",
    },
  });

  return chaps ?? [];
};

export const getChapterById = async (chapterId: string) => {
  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });

  return chapter ?? null;
};

// DELETE CHAP
export const deleteChapByIds = async (contentId: string, chapId: string) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour ajouter un contenu.",
    };
  }

  //   Check if exist?
  const IsContentExisted = await prisma.content.findUnique({
    where: { id: contentId },
  });

  if (!IsContentExisted) {
    return {
      error: true,
      message: "Ce contenu n'existe plus ou a été supprimé!",
    };
  }

  //   Check if user is the Author?
  const isAuthor = IsContentExisted.authorId === user.id;

  if (!isAuthor) {
    return {
      error: true,
      message: "Vous n'êtes pas l'auteur de ce contenu!",
    };
  }

  const isChapExisted = await prisma.chapter.findUnique({
    where: { id: chapId },
  });

  if (!isChapExisted) {
    return {
      error: true,
      message: "Ce chapitre n'existe plus ou a été supprimé!",
    };
  }

  const deleteChap = await prisma.chapter.delete({
    where: { id: isChapExisted.id },
  });
  if (!deleteChap) {
    return {
      error: true,
      message: "Impossible d'effectuer cette action, réessayez plus tard!",
    };
  }
  return {
    error: false,
    message: "Supprimé avec succès!",
  };
};
