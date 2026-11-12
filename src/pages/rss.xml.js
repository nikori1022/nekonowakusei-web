import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../site';

export async function GET(context) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const articles = (await getCollection('articles')).map((a) => ({
    title: a.data.title, description: a.data.description, pubDate: a.data.published, link: `${base}/articles/${a.id}/`,
  }));
  const diary = (await getCollection('diary')).map((d) => ({
    title: `【日記】${d.data.title}`, description: d.data.description, pubDate: d.data.published, link: `${base}/diary/${d.id}/`,
  }));
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: [...articles, ...diary].sort((a, b) => +b.pubDate - +a.pubDate),
    customData: '<language>ja</language>',
  });
}
