import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://suhendararyadi.dev',
  output: 'server',
  adapter: vercel({
    includeFiles: ['./node_modules/sql.js/dist/sql-wasm.wasm']
  }),
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
