"use server";
import { z } from "zod";
import { getUser } from "./authAction";
import { prisma } from "@/lib/prisma";
import {
  addNewPageSChema,
  modChapterSchema,
  newChapterSchema,
} from "@/schema/chaptersSchema";

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
  const isAuthor = IsContentExisted.userId === user.id;

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
  const isAuthor = IsContentExisted.userId === user.id;

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
  const isAuthor = IsContentExisted.userId === user.id;

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

// Add pages

export type addNewPageType = z.infer<typeof addNewPageSChema>;
export const addNewPage = async (data: addNewPageType) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour ajouter un contenu.",
    };
  }

  const validationResult = addNewPageSChema.safeParse(data);

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

  const isChapExist = await prisma.chapter.findUnique({
    where: { id: validated.chapterId },
  });

  if (!isChapExist) {
    return {
      error: true,
      message: "Ce chapitre n'existe plus ou a été supprimé!",
    };
  }

  const isPageWithThisNumberExist = await prisma.page.findFirst({
    where: {
      chapterId: validated.chapterId,
      order: validated.order,
    },
  });

  if (isPageWithThisNumberExist) {
    return {
      error: true,
      message: ` Cette page ${validated.order} de ce chapitre existe deja, supprimer pour modifier ou changer l'ordre!`,
    };
  }

  const addPage = await prisma.page.create({
    data: {
      chapterId: validated.chapterId,
      imageUrl: validated.imgUrl,
      order: validated.order,
    },
  });

  if (!addPage) {
    return {
      error: true,
      message: "Impossible d'ajouter, réessayez plus tard!",
    };
  }

  return {
    error: false,
    message: "Ajoutée avec succès",
  };
};

// GET ALLS PAGES
export const getPagesByChapterId = async (chapterId: string) => {
  const chaps = await prisma.page.findMany({
    where: { chapterId },
    orderBy: {
      order: "asc",
    },
  });

  return chaps ?? [];
};
