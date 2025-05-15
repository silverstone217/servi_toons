import { z } from "zod";

export const addContentSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  tags: z.array(z.string().min(1)).max(5),
  language: z.string().min(2).max(30),
  target: z.enum(["seinen", "shonen", "shojo", "josei", "kodomo"]),

  category: z.enum(["manga", "manhwa", "manhua", "comics", "light_novel"]),
  publishedAt: z.date(),
  isColored: z.boolean(),
  status: z.enum(["on_going", "finished", "hiatus"]),
});

export const addContentSecondSchema = z.object({
  image: z.string().url(),
  cover: z.string().url().optional(),
  contentId: z.string(),
});

export const modifyContentFPSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  target: z.enum(["seinen", "shonen", "shojo", "josei", "kodomo"]),
  contentId: z.string(),
  category: z.enum(["manga", "manhwa", "manhua", "comics", "light_novel"]),
  status: z.enum(["on_going", "finished", "hiatus"]),
});

export const modifyContentSISchema = z.object({
  tags: z.array(z.string().min(1)).max(5),
  publishedAt: z.date(),
  language: z.string().min(2).max(30),
  isColored: z.boolean(),

  contentId: z.string(),
});
