import { statusType } from "@/types/contentTypes";

export const isEmptyString = (value: string) => {
  return value.replace(/ /g, "") === "";
};

// slug formatting
export function createSlug(str: string): string {
  if (!str) {
    return ""; // Gérer le cas où la chaîne est vide ou null
  }

  const slug = str
    .normalize("NFD") // Normaliser pour supprimer les accents
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les diacritiques
    .toLowerCase() // Mettre en minuscule
    .replace(/[^a-z0-9 -]/g, "") // Supprimer les caractères non alphanumériques, tirets et espaces
    .trim() // Supprimer les espaces au début et à la fin
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/-+/g, "-"); // Remplacer les tirets multiples par un seul tiret

  return slug;
}

/**
 * Transforme un titre en slug unique avec 4 chiffres aléatoires à la fin.
 * @param title Le titre à transformer
 * @returns Un slug du type "mon-titre-1234"
 */
export function generateSlug(title: string): string {
  // 1. Mise en minuscules, suppression des accents, caractères spéciaux, espaces → tirets
  const slugBase = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // remplace tout sauf a-z et 0-9 par un tiret
    .replace(/^-+|-+$/g, "") // retire les tirets en début/fin
    .replace(/--+/g, "-"); // retire les doubles tirets

  // 2. Génération de 4 chiffres aléatoires
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // entre 1000 et 9999

  // 3. Retourne le slug final
  return `${slugBase}-${randomDigits}`;
}

type ReturnDataValueType = {
  value: string;
  data: { value: string; label: string }[];
};
export function returnDataValue({ data, value }: ReturnDataValueType) {
  return data.find((item) => item.value === value)?.label || "";
}

export const returnColorByStatus = (status: statusType): string => {
  switch (status) {
    case "hiatus":
      return "#CC8400"; // Orange

    case "finished":
      return "#4B5563"; // Bleu-gris sombre (hex pour Tailwind `gray-600`)

    default:
      return "#FFFFFF"; // Blanc
  }
};

// capitalize first letter
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return ""; // Vérifie si le texte est vide ou null
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// same arrays func
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function areArraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();
  return sortedArr1.every((element, index) => element === sortedArr2[index]);
}

// Convert Date TO string DD/MM/YYYY

// Convertit une date en string au format DD/MM/YYYY
export function convertDateToString(date: Date): string {
  const stringDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return stringDate;
}
