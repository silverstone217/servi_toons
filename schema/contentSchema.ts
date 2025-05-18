import { z } from "zod";

export const addContentSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(600),
  tags: z.array(z.string().min(1)).max(5).min(1),
  language: z.string().min(2).max(30),
  target: z.enum(["seinen", "shonen", "shojo", "josei", "kodomo"]),

  category: z.enum(["manga", "manhwa", "manhua", "comics", "light_novel"]),
  publishedAt: z.date(),
  isColored: z.boolean(),
  status: z.enum(["on_going", "finished", "hiatus"]),

  author: z.string().max(100).optional(),
  artist: z.string().max(100).optional(),
  edition: z.string().max(100).optional(),
  image: z.string().url(),
});

export const addContentSecondSchema = z.object({
  image: z.string().url(),
  cover: z.string().url().optional(),
  contentId: z.string(),
});

export const modifyContentFirstPartSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  contentId: z.string(),
  category: z.enum(["manga", "manhwa", "manhua", "comics", "light_novel"]),
});

export const modifyContentSecondPartSchema = z.object({
  isColored: z.boolean(),
  status: z.enum(["on_going", "finished", "hiatus"]),
  contentId: z.string(),
  tags: z.array(z.string().min(1)).max(5).min(1),
  target: z.enum(["seinen", "shonen", "shojo", "josei", "kodomo"]),
  language: z.string().min(2).max(30),
});

export const modifyContentThirdPartSchema = z.object({
  publishedAt: z.date(),
  author: z.string().max(100).optional(),
  artist: z.string().max(100).optional(),
  edition: z.string().max(100).optional(),

  contentId: z.string(),
});
