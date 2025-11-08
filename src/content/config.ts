import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    date: z.string(),
    description: z.string().optional(),
    featuredImage: z
      .object({
        src: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
        srcset: z.string().optional(),
        sizes: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  posts,
};
