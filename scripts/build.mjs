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

mkdirSync(join(root, 'public', 'assets'), { recursive: true });
execFileSync(process.execPath, [
  require.resolve('tailwindcss/lib/cli.js'),
  '-c', join(root, 'tailwind.config.js'),
  '-i', join(root, 'src', 'input.css'),
  '-o', join(root, 'public', 'assets', 'app.css'),
  '--minify'
], { stdio: 'inherit' });

console.log('Build terminé : public/assets/app.css et public/vendor/');
