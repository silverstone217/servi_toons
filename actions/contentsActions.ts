"use server";
import {
  addContentSchema,
  modifyContentFirstPartSchema,
  modifyContentSecondPartSchema,
  modifyContentThirdPartSchema,
} from "@/schema/contentSchema";
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
    ...(validated.artist
      ? { artist: validated.artist.toLocaleLowerCase().trim() }
      : {}),
    ...(validated.author
      ? { author: validated.author.toLocaleLowerCase().trim() }
      : {}),
    ...(validated.edition
      ? { edition: validated.edition.toLocaleLowerCase().trim() }
      : {}),
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

// MODIFY CONTENT
// 1. Modify title, desc, category
export type modifyFirstPartType = z.infer<typeof modifyContentFirstPartSchema>;

export const modifyFirstPart = async (content: modifyFirstPartType) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour modifier un contenu.",
      data: null,
    };
  }

  const validationResult = modifyContentFirstPartSchema.safeParse(content);

  if (!validationResult.success) {
    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      errors: validationResult.error.issues,
    };
  }

  const validated = validationResult.data;

  // Vérification de l'existence du contenu avec findFirst
  const isMyContentExist = await prisma.content.findFirst({
    where: {
      userId: user.id,
      id: validated.contentId,
    },
  });

  if (!isMyContentExist) {
    return {
      error: true,
      message: "Ce contenu n'existe plus ou vous n'êtes pas l'auteur !",
      data: null,
    };
  }

  const baseTitle = validated.title.toLowerCase().trim();
  const isTitleHasChanged =
    isMyContentExist.title.trim().toLowerCase() !== baseTitle;

  let slug = isMyContentExist.slug;

  if (isTitleHasChanged) {
    let attempts = 0;
    const maxAttempts = 10;
    let isSlugUnique = false;

    do {
      slug = generateSlug(baseTitle);
      const existingContent = await prisma.content.findUnique({
        where: { slug },
      });
      isSlugUnique = !existingContent;
      attempts++;
    } while (!isSlugUnique && attempts < maxAttempts);

    if (!isSlugUnique) {
      return {
        error: true,
        message:
          "Impossible de générer un slug unique après plusieurs tentatives.",
        data: null,
      };
    }
  }

  const modifyContent = await prisma.content.update({
    where: { id: validated.contentId },
    data: {
      title: validated.title,
      description: validated.description,
      category: validated.category,
      slug: isTitleHasChanged ? slug : isMyContentExist.slug,
    },
  });

  if (!modifyContent) {
    return {
      error: true,
      message:
        "Impossible d'effectuer cette action, veuillez réessayer plus tard !",
      data: null,
    };
  }

  return {
    error: false,
    message: "Modifié avec succès",
    data: modifyContent,
  };
};

// 2. Modify tags, lang, status, isColored
export type modifySecondPartType = z.infer<
  typeof modifyContentSecondPartSchema
>;
export const modifySecondPart = async (content: modifySecondPartType) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour modifier un contenu.",
      data: null,
    };
  }

  const validationResult = modifyContentSecondPartSchema.safeParse(content);

  if (!validationResult.success) {
    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      errors: validationResult.error.issues,
    };
  }

  const validated = validationResult.data;

  // Vérification de l'existence du contenu avec findFirst
  const isMyContentExist = await prisma.content.findFirst({
    where: {
      userId: user.id,
      id: validated.contentId,
    },
  });

  if (!isMyContentExist) {
    return {
      error: true,
      message: "Ce contenu n'existe plus ou vous n'êtes pas l'auteur !",
      data: null,
    };
  }

  const modifyContent = await prisma.content.update({
    where: { id: validated.contentId },
    data: {
      isColored: validated.isColored,
      target: validated.target,
      language: validated.language,
      tags: validated.tags,
    },
  });

  if (!modifyContent) {
    return {
      error: true,
      message:
        "Impossible d'effectuer cette action, veuillez réessayer plus tard !",
      data: null,
    };
  }

  return {
    error: false,
    message: "Modifié avec succès",
    data: modifyContent,
  };
};

// 3. Modify Edition, Author, Artist, Published date
export type modifyThirdPartType = z.infer<typeof modifyContentThirdPartSchema>;
export const modifyThirdPart = async (content: modifyThirdPartType) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour modifier un contenu.",
      data: null,
    };
  }

  const validationResult = modifyContentThirdPartSchema.safeParse(content);

  if (!validationResult.success) {
    console.log(validationResult.error.issues, "erreurs survenues");
    return {
      error: true,
      message: "Erreur de validation",
      errors: validationResult.error.issues,
    };
  }

  const validated = validationResult.data;

  // Vérification de l'existence du contenu avec findFirst
  const isMyContentExist = await prisma.content.findFirst({
    where: {
      userId: user.id,
      id: validated.contentId,
    },
  });

  if (!isMyContentExist) {
    return {
      error: true,
      message: "Ce contenu n'existe plus ou vous n'êtes pas l'auteur !",
      data: null,
    };
  }

  const publishedAt =
    validated.publishedAt instanceof Date
      ? validated.publishedAt
      : new Date(validated.publishedAt);

  // Préparation des données optionnelles
  const optionalFields = {
    ...(validated.artist
      ? { artist: validated.artist.toLocaleLowerCase().trim() }
      : {}),
    ...(validated.author
      ? { author: validated.author.toLocaleLowerCase().trim() }
      : {}),
    ...(validated.edition
      ? { edition: validated.edition.toLocaleLowerCase().trim() }
      : {}),
  };

  const modifyContent = await prisma.content.update({
    where: { id: validated.contentId },
    data: {
      ...optionalFields,
      publishedAt,
    },
  });

  if (!modifyContent) {
    return {
      error: true,
      message:
        "Impossible d'effectuer cette action, veuillez réessayer plus tard !",
      data: null,
    };
  }

  return {
    error: false,
    message: "Modifié avec succès",
    data: modifyContent,
  };
};

// 4. Publish or Not content
export const PublishedMyContent = async (contentId: string) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour modifier un contenu.",
      data: null,
    };
  }

  const isMyContentExist = await prisma.content.findUnique({
    where: { id: contentId, userId: user.id },
  });

  if (!isMyContentExist) {
    return {
      error: true,
      message: "Ce contenu n'existe plus ou vous n'êtes pas l'auteur !",
      data: null,
    };
  }

  const isPublished = isMyContentExist.isPublished ? false : true;

  const updateContent = await prisma.content.update({
    where: { id: contentId },
    data: {
      isPublished: isPublished,
    },
  });

  if (!updateContent) {
    return {
      error: true,
      message:
        "Impossible d'effectuer cette action, veuillez réessayer plus tard !",
      data: null,
    };
  }

  return {
    error: false,
    message: isPublished ? "Publié avec succès" : "Retiré de contenus publiés",
    data: updateContent,
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

// GET MY Chapters for CONTENT BY ID
export const getMyChpatersContentByID = async (id: string) => {
  const user = await getUser();
  if (!user) {
    return {
      error: true,
      message: "Veuillez vous connecter pour continuer.",
      data: [],
    };
  }

  const chapters = await prisma.chapter.findMany({
    where: {
      content: {
        id: id,
        userId: user.id,
      },
    },
  });

  if (!chapters) {
    return {
      error: true,
      message: "Ce comptenu n'existe pas ou a été supprimé!",
      data: [],
    };
  }
  return {
    error: false,
    message: "Contenu trouvé",
    data: chapters ?? [],
  };
};
