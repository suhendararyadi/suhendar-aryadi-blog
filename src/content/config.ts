import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()),
    category: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const modulesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subject: z.string(),
    grade: z.string(),
    downloadUrl: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  modules: modulesCollection,
};
