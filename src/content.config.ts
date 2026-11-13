import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(140),
    category: z.enum(['迎える準備', '暮らし', '猫の雑学', '北九州', '就労支援']),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    sources: z.array(z.object({ name: z.string(), url: z.string().url() })).default([]),
    /** 表紙写真（テン・ムギの写真。src/assets/cats/ 以下を相対パスで指定） */
    cover: image().optional(),
    coverAlt: z.string().optional(),
    /** 写真に写っている猫 */
    cats: z.array(z.enum(['テン', 'ムギ'])).default([]),
  }),
});

const diary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diary' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(140),
    published: z.coerce.date(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    cats: z.array(z.enum(['テン', 'ムギ'])).default([]),
  }),
});

export const collections = { articles, diary };
