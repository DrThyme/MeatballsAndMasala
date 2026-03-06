// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sv', 'hi'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
