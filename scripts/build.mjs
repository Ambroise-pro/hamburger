// Construit les fichiers statiques auto-hébergés (aucun script tiers chargé depuis un CDN) :
//  - public/assets/app.css : Tailwind compilé et minifié ;
//  - public/vendor/*.js     : SDK Firebase (compat) copiés depuis node_modules (version figée par package-lock.json).
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const vendorDir = join(root, 'public', 'vendor');
mkdirSync(vendorDir, { recursive: true });
const firebaseDir = dirname(require.resolve('firebase/package.json'));
for (const name of ['app', 'app-check', 'auth', 'firestore']) {
  copyFileSync(join(firebaseDir, `firebase-${name}-compat.js`), join(vendorDir, `firebase-${name}-compat.js`));
}

// Polices auto-hébergées (aucune requête vers Google Fonts : l'IP des visiteurs n'est pas transmise).
const fontsDir = join(root, 'public', 'assets', 'fonts');
mkdirSync(fontsDir, { recursive: true });
const fonts = [
  ['@fontsource/dm-sans', 'dm-sans-latin-400-normal.woff2'],
  ['@fontsource/dm-sans', 'dm-sans-latin-500-normal.woff2'],
  ['@fontsource/dm-sans', 'dm-sans-latin-700-normal.woff2'],
  ['@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-600-normal.woff2'],
  ['@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff2']
];
for (const [pkg, file] of fonts) {
  copyFileSync(join(dirname(require.resolve(`${pkg}/package.json`)), 'files', file), join(fontsDir, file));
}

mkdirSync(join(root, 'public', 'assets'), { recursive: true });
execFileSync(process.execPath, [
  require.resolve('tailwindcss/lib/cli.js'),
  '-c', join(root, 'tailwind.config.js'),
  '-i', join(root, 'src', 'input.css'),
  '-o', join(root, 'public', 'assets', 'app.css'),
  '--minify'
], { stdio: 'inherit' });

console.log('Build terminé : public/assets/app.css et public/vendor/');
