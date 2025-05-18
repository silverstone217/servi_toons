import { z } from "zod";

export const newChapterSchema = z.object({
  title: z.string().max(30).optional(),
  order: z.number().min(0).max(10000),

  contentId: z.string(),
});

export const modChapterSchema = z.object({
  title: z.string().max(30).optional(),
  order: z.number().min(0).max(10000),
  chapterId: z.string(),
  contentId: z.string(),
});

// PAGES
export const addNewPageSChema = z.object({
  order: z.number().min(1).max(10000),
  chapterId: z.string(),
  contentId: z.string(),
  imgUrl: z.string().url(),
});
