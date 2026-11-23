// Orb Garden, day one / day seven — the entry program for make.fun's
// "Day one, day seven" TikTok bounty (Node 22, standard library only).
// It copies VIDEO.json from the repository root to /output/VIDEO.json,
// where the gate reads it. That is all the program has to do: the entry
// is the video itself (ad.mp4 in this repository), posted publicly on
// TikTok from @arifuzzaman656 with the bounty line and the play code in
// its caption. VIDEO.json here holds a placeholder address until the
// video is posted; the gate refuses a placeholder, so replace it with
// the video's full address before submitting.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A video's address on TikTok, as the gate reads it: the canonical
// /@<handle>/video/<id> form. Short links and photo posts are refused.
const VIDEO_URL = /^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+$/;

const videoPath = join(BOT_DIR, 'VIDEO.json');
const video = JSON.parse(readFileSync(videoPath, 'utf8'));
if (video === null || typeof video !== 'object' || Array.isArray(video)) {
  console.error('VIDEO.json must be a JSON object like {"url": "https://www.tiktok.com/@handle/video/123"}');
  process.exit(1);
}
if (typeof video.url !== 'string' || !VIDEO_URL.test(video.url)) {
  console.error(`VIDEO.json does not name a TikTok video: ${video.url}`);
  console.error('Expected https://www.tiktok.com/@<handle>/video/<id> (a short link or photo post is refused).');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`VIDEO.json copied: ${video.url}`);
