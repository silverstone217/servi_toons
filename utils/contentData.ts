import manga1 from "@/public/images/manga1.png";
import manga2 from "@/public/images/manga2.png";
import manga3 from "@/public/images/manga3.jpg";
import manga4 from "@/public/images/manga4.jpg";
import manga5 from "@/public/images/manga5.jpg";

export const ContentsData = [
  {
    title: "L'Épopée du Chevalier Dragon",
    slug: "l-epopee-du-chevalier-dragon",
    image: manga1,
    description:
      "Un jeune chevalier découvre un ancien artefact et se lance dans une quête pour sauver le royaume.",
    category: "manga",
    tags: ["aventure", "fantaisie", "magie", "combat"],
    target: "shonen",
    authorId: "auth001",
    language: "en",
  },
  {
    title: "Les Secrets de l'Académie Lunaire",
    slug: "les-secrets-de-l-academie-lunaire",
    image: manga2,
    description:
      "Une jeune fille timide découvre qu'elle a des pouvoirs magiques et doit naviguer dans les complexités de l'Académie Lunaire.",
    category: "manhua",
    tags: ["magie", "romance", "ecole", "mystere"],
    target: "shojo",
    authorId: "auth002",
    language: "es",
  },
  {
    title: "Chroniques d'une Vie Quotidienne",
    slug: "chroniques-d-une-vie-quotidienne",
    image: manga3,
    description:
      "Une tranche de vie humoristique suivant le quotidien d'une jeune femme et de ses amis à Tokyo.",
    category: "manga",
    tags: ["comedie", "slice of life", "amitié", "ville"],
    target: "josei",
    authorId: "auth003",
    language: "fr",
  },
  {
    title: "L'Ombre du Samouraï",
    slug: "l-ombre-du-samourai",
    image: manga4,
    description:
      "Un samouraï solitaire erre dans le Japon féodal, cherchant à venger la mort de son maître.",
    category: "manga",
    tags: ["action", "historique", "samourai", "vengeance"],
    target: "seinen",
    authorId: "auth004",
    language: "jp",
  },
  {
    title: "Le Voyage de Kiko",
    slug: "le-voyage-de-kiko",
    image: manga5,
    description:
      "Un jeune garçon curieux part à la découverte du monde qui l'entoure, rencontrant des créatures fantastiques.",
    category: "manhwa",
    tags: ["aventure", "enfant", "decouverte", "fantaisie"],
    target: "kodomo",
    authorId: "auth005",
    language: "fr",
  },
];
