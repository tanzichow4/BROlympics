import { resolve } from 'node:path';
import { createApp } from './app';

const password = process.env.ADMIN_PASSWORD;
const secret = process.env.SESSION_SECRET;

if (!password || !secret || secret.length < 16) {
  console.error(
    'Set ADMIN_PASSWORD and SESSION_SECRET (16+ characters) in .env. See .env.example.',
  );
  process.exit(1);
}

const production = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3001;

const app = createApp({
  password,
  secret,
  dataFile: resolve(process.env.DATA_FILE ?? 'server/data/season.json'),
  distDir: resolve('dist'),
  secureCookie: production,
});

// Behind a proxy (Render, Fly, Heroku...) so req.ip and Secure cookies work.
if (production) app.set('trust proxy', 1);

app.listen(port, () => {
  console.log(`Brolympics server on http://localhost:${port}`);
});
